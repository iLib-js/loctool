# external_user_metric.rb
# This class handles querying 2 tables:
#    DynamoDB table ENV-external-user-metrics. This table stores actual data imported from HealthKit/google fit/etc.
#    MySql table external_user_metrics. This table stores data aggregated so that there is 1 row for each user, metric and source.
#      this table is for analytics.

### NOTE: when adding new metrics to accept, check MemberProfile to see if that value should be stored in member profile


# some dynamo querying info:
#   you can query over 1 index at once.
#   to query over an index, you must provide conditions on both the hash and range key.
#   in order to query over an index, use :index_name=>'name' in the client.query object (see http://stackoverflow.com/questions/18020353/dynamodb-querying-tables-with-secondary-index)
# for external-user-metrics tables, we have 3 indices:
#   default index:
#      hash key: person_id_metric
#      range key: start_ts
#   source-start_ts-index
#      hash key: source
#      range key: start_ts
#   metric-start_ts-index
#      hash key: metric
#      range key: start_ts

require './lib/unit_converter'
require 'ht_graylog'

class ExternalUserMetric < ActiveRecord::Base
  METRICS ||= YAML.load_file("#{Rails.root}/config/external_import_metrics.yml")
  COLUMNS ||= [:person_id, :metric, :person_id_metric, :start_ts, :duration, :value, :details, :source, :unit, :source_category]
  REQUIRED_COLUMNS ||= COLUMNS - [:source_category, :details, :duration] # these few are optional values.
  METRICS_TO_USER_PROFILE ||= %w(height weight blood_type biological_sex date_of_birth)
  DYNAMO_BATCH_WRITE_LIMIT ||= 25
  ACCEPTED_SOURCES ||= %w(healthkit google applewatch s_health ihealth) #to be a valid source the :source field must CONTAIN one of these strings.
  SHOW_LATEST_ONLY ||= %w(blood_type date_of_birth biological_sex)
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z]+)*\.[a-z]+\z/i
  IHeahthDevices = %w{BP BG PO HS}

  #flag to turn on/off external metrics on production
  SEND_EXTERNAL_METRICS = !(Rails.env == 'staging')

  ################################### FETCHING DATA

  # fetch retrieves incoming data from a Dynamo table (ENV-external-user-metrics.)
  # params includes:
  #    metrics: comma-separated list of metrics (e.g. "height,weight")
  #    person_id e.g. 12345567
  #    n_points: number of points to retreive, counting back from the current time*
  #    start_ts, end_ts: integer timestamps within which to retreive data*
  #    one of n_points or start_ts is required. n_points overrides start_ts and end_ts if they are provided.
  def self.fetch(params)
    if params[:person_id].nil? or Person.where(:id => params[:person_id]).empty?
      error_msg = 'In :fetch : invalid or no person_id provided.'
      localized_error_msg = Rb.t(error_msg)
      error = ArgumentError.new(error_msg)
      log_error(error)
      return {:result => false, :message => "ArgumentError: #{error.to_s}", :message_localized => Rb.t("ArgumentError: %{error}", :variables => {error: ArgumentError.new(localized_error_msg).to_s})}
    end
    begin
      params = params.symbolize_keys
      metrics = parse_metrics(params[:metrics])
      out = self.get_dynamo_metrics(params[:person_id], metrics, params[:n_points].to_i, params[:start_ts], params[:stop_ts])
      out[:metrics] = out[:metrics].reject{|k, v| k == 'blood_pressure' || k == 'feel_good_journal'} if out[:metrics].present?
      return out
    rescue => error
      log_error(error, params[:person_id])
      {:result => false, :message => "#{error.to_s}"}
    end
  end

  def self.all_metrics_by_category(person_id, n_points=10)
    return {} if SEND_EXTERNAL_METRICS == false
    metrics = fetch ({person_id: person_id, metrics: 'all', n_points: n_points})
    return {} if metrics[:result]==false
    out = {}
    metrics[:metrics].keys.each do |metric|
      out[category_for_metric(metric)] ||= {}
      out[category_for_metric(metric)][metric] = metrics[:metrics][metric]
    end
    out = add_compound_blood_pressure(out)
    out = filter_last_values(out)
    out
  end

  def self.filter_last_values(out_data)
    out_data.each {|category, cat_data|
      cat_data.each {|metric, metric_data|
        if SHOW_LATEST_ONLY.include?(metric)
          latest = metric_data.max_by{|measurement| measurement[:timestamp]}
          out_data[category][metric] = [latest]
        end
      }
    }
    out_data
  end

  def self.add_compound_blood_pressure(out_data)
    bp = []
    return out_data if out_data['vital_signs'].blank?
    bp_d = out_data['vital_signs']['blood_pressure_diastolic']
    bp_s = out_data['vital_signs']['blood_pressure_systolic']
    return out_data if bp_s.blank? or bp_d.blank?
    bp_d.each {|d_reading|
      systolic_same_time = bp_s.select{|s_reading| s_reading[:timestamp]==d_reading[:timestamp]}.first
      to_add = d_reading.dup
      to_add[:value] = "#{systolic_same_time[:value]}/#{d_reading[:value]}"
      bp << to_add
    }
    out_data['vital_signs']['blood_pressure'] = bp
    out_data
  end

  # parse a comma-separated string of metrics into an array, excluding metrics not in valid_metrics.
  def self.parse_metrics(metrics)
    if metrics.nil? or metrics.blank?

    end
    raise 'Error in ExternalUserMetrics: no metrics provided' if metrics.nil? or metrics.blank?

    return valid_metrics if metrics.downcase == 'all'
    out = []
    metrics.split(',').each do |metric|
      if valid_metrics.include? metric
        out << metric
      elsif metric[0..3].downcase == 'all_'
        out << metrics_in_category(metric[4..metric.length])
      end
    end
    raise 'Error in ExternalUserMetrics: no valid metrics provided' if out.empty?
    out.flatten
  end

  # given a person_id, array of metrics, n_points, art and stop timestamps,
  # retrieve the appropriate data from Dynamo.
  # out is an object like:
  #  {"result":true,"metrics":{
  #   "weight":[{"timestamp":"2014-05-13T10:53:20-07:00","value":"185","unit":"lbs","details":"after eating","duration":null},
  #             {"timestamp":"2014-05-13T09:53:20-07:00","value":"180","unit":"lbs","details":"before eating","duration":null}],
  #   "height":[]}}
  def self.get_dynamo_metrics(person_id, metrics, n_points, start, stop)
    query_obj = {table_name: dynamo_table}
    if (n_points != nil) && (n_points > 0)
      if stop.blank?
        query_obj = self.key_conditions_for_n_points(query_obj, n_points)
      else
        query_obj = self.key_conditions_for_n_points_before_stop_ts(query_obj, n_points, stop)
      end
    else
      stop ||= Time.now.to_i
      if start.nil? or start.to_i == 0 or stop.to_i == 0
        raise ArgumentError.new('Error in ExternalUserMetrics: Please provide either n_points or start_ts')
      elsif start.to_i > stop.to_i
        raise ArgumentError.new('Error in ExternalUserMetrics: Your start time is later than your start time')
      else
        query_obj = self.key_conditions_for_time_range(query_obj, start, stop)
      end
    end
    out = {:result=>true, :metrics=>{}}
    metrics.each do |metric|
      cur_query_obj = self.key_conditions_for_metric(query_obj, person_id, metric).dup
      out[:metrics][metric] = extract_result_from_query(cur_query_obj, person_id)
    end
    out
  end


  # this method takes a Dynamo query object, runs it and returns the result.
  def self.extract_result_from_query(query_obj, person_id)
    out = []
    query_dynamo(query_obj)[:member].each do |row|
      begin
        out << { :timestamp => Time.at(row['start_ts'][:n].to_i)}
        value = row['value'][:n]
        if value.nil?
          value = row['value'][:s]
        end
        out.last[:value] = value
        out.last[:unit] = self.format_unit(row) if row.keys.include? 'unit'
        out.last[:details] = row['details'][:s] if row.keys.include? 'details'
        out.last[:duration] = row['duration'][:s] if row.keys.include? 'duration'
      rescue => error # do not handle this single-row error because other rows may be successful
        log_error(error, person_id)
      end
    end
    out
  end

  #TODO: handle formats better. this is for displaying units
  def self.format_unit(row)
    if %w(unitless number date).include? (row['unit'][:s].downcase)
      unit = 'none'
    elsif %w(percent percentage).include? (row['unit'][:s].downcase)
      unit = '%'
    else
      unit = row['unit'][:s]
    end
    unit
  end

  # update a Dynamo query object to include conditions on a time range between start and stop.
  def self.key_conditions_for_time_range(obj, start, stop)
    obj[:key_conditions] ||= {}
    obj[:key_conditions]['start_ts'] = {
        comparison_operator: 'BETWEEN',
        attribute_value_list: [ {:n=> start.to_i.to_s},{:n=> stop.to_i.to_s} ]
    }
    obj
  end

  # update a Dynamo query object to include conditions on the most recent n_points.
  def self.key_conditions_for_n_points(obj, n_points)
    obj[:limit] = n_points
    obj[:scan_index_forward] = false
    obj
  end

  # update a Dynamo query object to include conditions on the most recent n_points before stop_ts.
  def self.key_conditions_for_n_points_before_stop_ts(obj, n_points, stop)
    obj[:key_conditions] ||= {}
    obj[:key_conditions]['start_ts'] = {
        comparison_operator: 'LE',
        attribute_value_list: [ {:n=> stop.to_i.to_s} ]
    }
    obj[:limit] = n_points
    obj[:scan_index_forward] = false
    obj
  end

  # update a Dynamo object to include conditions to return only a single metric.
  def self.key_conditions_for_metric(obj, person_id, metric)
    obj[:key_conditions] ||= {}
    obj[:key_conditions]['person_id_metric'] = {
        comparison_operator: 'EQ',
        attribute_value_list: [ {:s=> "#{person_id}_#{metric}"} ]
    }
    obj
  end

  # update a Dynamo object to include conditions to return all metrics.
  def self.key_conditions_for_all_metrics(obj, person_id)
    obj[:key_conditions] ||= {}
    obj[:key_conditions]['person_id'] = {
        comparison_operator: 'EQ',
        attribute_value_list: [ {:s=> person_id.to_s } ]
    }
    obj
  end

  ################################### UPDATING DATA


  # data will come in through `msg_data`, where that data is in Ruby format (parsed from JSON).
  # The objects are of type:
  # { :person_id => <number>,
  #   :source => <string>,
  #   :metrics =>
  #     [
  #       { :name => <string>,
  #         :source_category => <string> (optional),
  #         :unit => <string>,
  #         :data =>
  #           [
  #             {:start_ts => <integer timestamp>, :value => <number>, :duration => <integer in seconds>, :details => <string> },
  #             {...},
  #             {...}
  #           ]
  #       },
  #       { <another metric> }
  #     ]
  # }
  def self.update(msg_data)
    msg_data = sanitize_object_keys(msg_data)
    val, error_msg, msg_data = validate_input(msg_data)
    unless val
      error = ArgumentError.new("Invalid message input: #{error_msg}")
      log_error(error)
      return {:result => false, :error_msg => "Invalid message input: #{error_msg}", :error_msg_localized => Rb.t("Invalid message input: %{error}", :variables => {error: error_msg})}
    end
    begin
      msg_data = convert_all_units(msg_data)
      items = create_metric_items(msg_data)
      validate_to_write(items)
      error_msg = error_msg + save_user_profile_data(msg_data)
      table = Healthtap::NoSql.external_user_metrics_table
      write_to_dynamo(items, table, DYNAMO_BATCH_WRITE_LIMIT)
      update_analytics(items)
      {:result => true, :warnings => error_msg}
    rescue => ex
      log_error(ex, msg_data[:person_id])
      return {:result => false, :error_msg => "We ran into an unaccounted-for case. #{ex.to_s}", :error_msg_localized => Rb.t("We ran into an unaccounted-for case. %{ex}", :variables => {ex: ex.to_s})}
    end
  end

  # Write to dynamo in increments of slice_size (should be 25 by default; this is the max number of items that Dynamo will accept).
  # if the sliced items are still too big, recurse with half the number of items.
  # Throw an error if slice slize <= 2 and Dynamo still complains.
  def self.write_to_dynamo(items, table, slice_size)
    items.each_slice(slice_size) do |item_slice|
      begin
        batch = AWS::DynamoDB::BatchWrite.new
        batch.put(table, item_slice)
        batch.process!
      rescue AWS::DynamoDB::Errors::ValidationException => e
        if slice_size <= 2
          raise "With slice size #{slice_size}: #{e}"
        end
        write_to_dynamo(item_slice, table, (slice_size / 2) + 1)  #YAY RECURSION -- C106B was good for something!!
      end
    end
  end

  # record METRICS_TO_USER_PROFILE in user profile
  def self.save_user_profile_data(msg_data)
    person = nil
    warnings = ''
    msg_data[:metrics].each do |metric|
      if METRICS_TO_USER_PROFILE.include? metric[:name]
        person ||= Person.find(msg_data[:person_id])
        latest = metric[:data].sort_by{|k| k[:start_ts]}.last[:value]
        warnings += save_user_profile_datapoint(person, latest, metric)
      end
    end
    person.save unless person.nil?
    # this will not work for birthday if the person is not confirmed- but I'll just not save their birthday because I don't want to wrongly mark them as confirmed.
    warnings
  end

  # save the data point (latest) to person's profile.
  # return warnings if there are any.
  def self.save_user_profile_datapoint(person, latest, metric)
    case metric[:name]
      when 'biological_sex'
        if latest[0].downcase == 'f'
          person.sex = 'F'
        elsif latest[0].downcase == 'm'
          person.sex = 'M'
        else
          return "biological_sex #{latest} was not parseable as Male or Female."
        end
      when 'blood_type'
        person.blood_type = latest
      when 'weight'
        weight = UnitConverter.convert('mass',latest,metric[:unit],'lb')
        return weight[2] unless weight[2].empty?
        person.weight = weight[0]
      when 'height'
        height = UnitConverter.convert('length',latest,metric[:unit],'inch')
        return height[2] unless height[2].empty?
        person.height_in = (height[0] % 12)
        person.height_ft = (height[0] / 12).round
      when 'date_of_birth'
        begin
          person.birthday = (latest.class == String) ? Date.parse(latest) : latest
        rescue => error
          return error.to_s
        end
      else
    end
    ''
  end

  def self.set_recorded(source, person_id)
    person = Person.find person_id
    if source.downcase.include? 'healthkit'
      person.healthkit_recorded = 1
    elsif source.downcase[0..5] == 'google'
      person.googlefit_recorded = 1
    elsif source.downcase.include? 's_health'
      person.s_health_recorded = 1
    elsif source.downcase.include? 'ihealth'
      person.ihealth_recorded = 1
    end
    set_detected(source, person_id)
  end

  # update the analytics tables when inserting data to Dynamo
  def self.update_analytics(items)
    set_recorded(items.first[:source], items.first[:person_id])
    items.each do |row|
      metric = row[:metric]
      existing_rows = ExternalUserMetric.where(person_id: row[:person_id], metric: metric, source: row[:source])
      if existing_rows.empty?
        ExternalUserMetric.create(person_id:      row[:person_id],
                                  metric:         metric,
                                  category:       category_for_metric(metric),
                                  source:         row[:source],
                                  times_imported: 1)
      else
        existing_rows.each do |to_update|
          to_update[:times_imported] = to_update[:times_imported] + 1
          to_update.save
        end
      end
    end
  end

  def self.convert_all_units(msg_data)
    out = msg_data.dup
    out[:metrics].each_with_index do |metric,i|
      out[:metrics][i] = convert_metric(metric)
    end
    out
  end

  def self.convert_metric(metric)
    goal_unit = standard_unit_for_metric(metric[:name])
    cur_unit = metric[:unit]
    type = type_for_metric(metric[:name])
    metric[:data].each_with_index do |point, i|
      if metric[:name] == 'biological_sex'
        if point[:value][0].downcase == 'f'
          point[:value] = 'female'
        elsif point[:value][0].downcase == 'm'
          point[:value] = 'male'
        end
      else
        res = UnitConverter.convert(type, point[:value], cur_unit, goal_unit)
        if res[1] == cur_unit
          return metric # we can't convert any points if we can't convert 1 point - then there will be inconsistencies
        elsif res[1] != goal_unit
          if i == 0 # goal unit is not recognized;
            goal_unit = res[1]
          else
            # there is some inconsistency in the goal units
            return metric
          end
        end
        point[:value] = res[0].round(3)
      end
    end
    metric[:unit] = goal_unit
    metric
  end
  # ensure that all required columns are present, and no unknown columns are present
  def self.validate_to_write(items)
    items.each {|item|
      return false unless (item.keys - COLUMNS).blank? and (REQUIRED_COLUMNS - item.keys).blank?
    }
    true
  end

  def self.valid_source?(source)
    norm_source = source.to_s.downcase.gsub(' ','')
    ACCEPTED_SOURCES.each {|valid_source| return true if norm_source.include? valid_source}
    false
  end

  def self.validate_input(msg_data)
    warnings = ''
    return [false, Rb.t('data is missing or empty.')] if msg_data.blank?
    keys = msg_data.keys
    [:person_id, :source, :metrics].each {|val| return [false, Rb.t("data[%{val}] is missing or empty.", :variables => {val: val})] if msg_data[val].blank? }
    return [false, Rb.t("Invalid source. It must **contain** one of the strings in #{ACCEPTED_SOURCES}")] unless valid_source?(msg_data[:source])
    return [false, Rb.t("Person %{person_id} does not exist.", :variables => {person_id: msg_data[:person_id]})] if Person.where(:id=>msg_data[:person_id]).blank?
    to_delete = []
    msg_data[:metrics].each_with_index do |metric_obj, metric_idx|
      keys = (keys + metric_obj.keys).uniq
      [:name, :data].each {|val| return [false, Rb.t("metric[%{val}] is missing or empty.", :variables => {val: val})] if metric_obj[val].blank? }
      metric_obj[:data].each do |datapoint|
        keys = (keys + datapoint.keys).uniq
        [:start_ts, :value].each {|val| return [false, Rb.t("metric[%{val}] is missing or empty.", :variables => {val: val})] if datapoint[val].blank? }
      end
      metric_name = metric_obj[:name].downcase
      unless valid_metrics.include?(metric_name)
        to_delete << metric_idx
        warnings += Rb.t("%{metric_name} is not a valid metric; ignoring", :variables => {metric_name: metric_obj[:name]})
        next
      end
      if metric_obj[:unit].nil? and !METRICS[metric_name]['unit'].nil?
        to_delete << metric_idx
        warnings += Rb.t("%{metric_name} doesn't have a unit; ignoring %{metric_name}", :variables => {metric_name: metric_obj[:name]})
        next
      end
    end
    to_delete.each {|delete| msg_data[:metrics].delete_at(delete)}
    return [false, Rb.t("%{warnings}... No valid metrics provided", :variables => {warnings: warnings})] if msg_data[:metrics].empty?
    [true, warnings, msg_data]
  end

  def self.sanitize_object_keys(msg_data)
    return {} if msg_data.blank?
    msg_data = msg_data.deep_symbolize_keys
    msg_data = msg_data.inject({}){|memo,(k,v)| memo[k.downcase] = v; memo}
    unless msg_data[:metrics].blank?
      msg_data[:metrics].each_with_index do |metric_obj, metric_idx|
        metric_obj = metric_obj.deep_symbolize_keys
        metric_obj = metric_obj.inject({}){|memo,(k,v)| memo[k.downcase] = v; memo}
        metric_obj[:name] = metric_obj[:name].downcase unless metric_obj[:name].blank?
        metric_obj[:unit] = metric_obj[:unit].downcase unless metric_obj[:unit].blank?
        unless metric_obj[:data].blank?
          metric_obj[:data].each_with_index do |data_point, dp_idx|
            data_point = data_point.deep_symbolize_keys
            data_point = data_point.inject({}){|memo,(k,v)| memo[k.downcase] = v; memo}
            metric_obj[:data][dp_idx] = data_point
            msg_data[:metrics][metric_idx] = metric_obj
          end
        end
      end
    end
    msg_data
  end

  def self.create_metric_items(msg_data)
    objects = []
    msg_data[:metrics].each do |current_metric|
      current_metric[:data].each do |datapoint|
        obj_hash = {}
        obj_hash[:person_id] = msg_data[:person_id]
        obj_hash[:source] = msg_data[:source]
        obj_hash[:metric] = current_metric[:name]
        obj_hash[:source_category] = current_metric[:source_category] unless current_metric[:source_category].blank?
        obj_hash[:unit] = current_metric[:unit].blank? ? 'none' : current_metric[:unit]
        obj_hash = obj_hash.merge(datapoint) #adds start_ts, value, (and optionally) duration and details.
        obj_hash[:person_id_metric] = "#{obj_hash[:person_id]}_#{obj_hash[:metric]}"
        objects << obj_hash
      end
    end
    objects
  end

  def self.format_ihealth_data(web_data)
    begin
      raise ArgumentError.new('Invite Code is missing') if web_data['inviteCode'].blank?
      raise ArgumentError.new('Device Type is missing') if web_data['deviceType'].blank?
      raise ArgumentError.new('MeasuredAt ts is missing') if web_data['measuredAt'].blank?
      raise ArgumentError.new('Data is missing') if web_data['data'].blank?
      # Hack for now to hard code email
      inviteCode = web_data['inviteCode'].try(:strip)
      if 1.upto(1000).map{|i|  "healthtap_#{i}"}.include?(inviteCode)
        mp = MemberProfile.where(:key => 'ihealth_invite_code', :value => inviteCode).try(:last)
        person_id = mp.try(:person_id)
      end
      raise ArgumentError.new("Person cannot be found at invitation code #{inviteCode}") if person_id.blank? && Rails.env.staging?
      if person_id.blank?
        person = Person.find_by_email('dechao+1@healthtap.com')
        person_id = person.try(:id)
      end
      #   email = 'dechao+1@healthtap.com'
      # else
      #   email = inviteCode
      # end
      # email = 'dechao+1@healthtap.com' unless email =~ VALID_EMAIL_REGEX
      raise ArgumentError.new("Person cannot be found at inviteCode #{inviteCode}") if person_id.blank?
      raise ArgumentError.new('Invalid deviceType') unless IHeahthDevices.include?(web_data['deviceType'])
      msg_data = {:person_id => person_id, :source => 'ihealth', :metrics => []}
      external_id = web_data['id']
      start_ts = Time.parse(web_data['measuredAt']).to_i
      web_data['data'].each do |key, val|
        current_metric = {}
        current_metric[:data] = [{:start_ts => start_ts, :value => val.to_s}]
        case(key)
          when 'systolic'
            current_metric[:name] = "blood_pressure_systolic"
            current_metric[:unit] = "mmhg"
          when 'diastolic'
            current_metric[:name] = "blood_pressure_diastolic"
            current_metric[:unit] = "mmhg"
          when 'heartRate'
            current_metric[:name] = "heart_rate"
            current_metric[:unit] = "beats/minute"
            current_metric[:details] = {
                'arrhythmia' => web_data['data']['arrhythmia'].to_s,
                'perfusionIndex' => web_data['data']['perfusionIndex'].to_s,
              }.to_json
          when 'bloodGlucose'
            current_metric[:name] = "blood_glucose"
            current_metric[:unit] = "mg/dl"
            current_metric[:details] = {
                'beforeMeal' => web_data['data']['beforeMeal'].to_s,
                'mealType' => web_data['data']['mealType'].to_s
              }.to_json
          when 'oxygenSaturation'
            current_metric[:name] = "oxygen_saturation"
            current_metric[:unit] = "percent"
          when 'bodyWeight'
            current_metric[:name] = "weight"
            current_metric[:unit] = "kg"
          else
            next
        end
        msg_data[:metrics].push(current_metric)
      end
      msg_data

        #if web_data['deviceType'] == 'BP'
      #  metrics_data = []
      #  web_data['data'].each do |name, val|
      #    metrics_data << {:start_ts => Time.parse(web_data['measuredAt']).to_i, :value => val.to_s, :details => name}
      #  end
      #  msg_data[:metrics] << {:name => 'blood_pressure', :unit => 'mmhg', :data => metrics_data}
      #end
      #msg_data

    rescue => ex
      Airbrake.notify(ex)
      nil
    end
  end

  ######################################################## ANALYTICS
  # number of data points ever imported
  # table should have columns person_id, metric, category, source, times_imported
  # will have max n_users * n_metrics * n_sources imported

  def self.total_points
    return {result: true, data: ExternalUserMetric.sum(:times_imported) }
  rescue => e
    return {result: false, error_msg: e.to_s}
  end

  # total number of points ever imported per source
  def self.count_points_per_source
    return {result: true, data: ExternalUserMetric.group(:source).sum(:times_imported) }
  rescue => e
    return {result: false, error_msg: e.to_s}
  end

  # total number of users who imported data from any source
  def self.total_users_who_imported
    return {result: true, data: ExternalUserMetric.pluck('distinct person_id').length }
  rescue => e
    return {result: false, error_msg: e.to_s}
  end

  # metrics (e.g. temperature) imported per person and source
  def self.metrics_imported_per_user
    return {result: true, data: ExternalUserMetric.group(:person_id,:source).sum(:times_imported) }
  rescue => e
    return {result: false, error_msg: e.to_s}
  end

  def self.analytics_table
    return {result: true, data: ExternalUserMetric.all }
  rescue => e
    return {result: false, error_msg: e.to_s}
  end

  def self.points_over_time_by_source(params)
    query_obj = { table_name: dynamo_table,
                  index_name: 'source-start_ts-index', select: 'COUNT',   key_conditions: {
            'source' => {
                comparison_operator: 'EQ',
                attribute_value_list: [ {'s' => params[:source]} ]
            },
            'start_ts' => {
                comparison_operator: 'BETWEEN',
                attribute_value_list:
                    [ {:n => "#{params[:start].to_i}"}, {:n=>"#{(params[:stop] || Time.now).to_i}"}  ]
            }
        }
    }
    return {result: true, data: query_dynamo(query_obj)[:count] }
  rescue => e
    return {result: false, error_msg: e.to_s}
  end

  def self.points_over_time_by_metric(params)
    data = {}
    valid_metrics.each do |metric|
      query_obj = {table_name: dynamo_table,
                   index_name: 'metric-start_ts-index', select: 'COUNT', key_conditions: {
              'metric' => {
                  comparison_operator: 'EQ',
                  attribute_value_list: [{'s' => metric}]
              },
              'start_ts' => {
                  comparison_operator: 'BETWEEN',
                  attribute_value_list:
                      [{:n => "#{params[:start].to_i}"}, {:n => "#{(params[:stop] || Time.now).to_i}"}]
              }
          }
      }
      data[metric] = query_dynamo(query_obj)[:count]
    end
    return {result: true, data: data}
  rescue => e
    return {result: false, error_msg: e.to_s}
  end

  def self.set_detected(source, person_id)
    person = Person.find person_id
    valid_msg = "Noted that person #{person_id} has #{source} installed"
    valid_msg_localized = Rb.t("Noted that person %{person_id} has %{source} installed", :variables => {person_id: person_id, source: source})
    if source.downcase == 'healthkit'
      person.healthkit_detected = 1
      return {result: true, msg: valid_msg, msg_localized: valid_msg_localized}
    elsif source.downcase == 'google'
      person.googlefit_detected = 1
      return {result: true, msg: valid_msg, msg_localized: valid_msg_localized}
    elsif source.downcase == 's_health'
      person.s_health_detected = 1
      return {result: true, msg: valid_msg, msg_localized: valid_msg_localized}
    elsif source.downcase == 'ihealth'
      person.ihealth_detected = 1
      return {result: true, msg: valid_msg, msg_localized: valid_msg_localized}
    else
      return {result: false, msg: "Error in ExternalUserMetric.set_detected: source #{source} unrecognized",
        msg_localized: Rb.t("Error in ExternalUserMetric.set_detected: source %{source} unrecognized", :variables => {source: source})
      }
    end
  rescue => e
    return {result: false, msg: e.to_s, msg_localized: Rb.t(e.to_s)}
  end

  ######################################################## HELPERS
  # this method is necessary for stubbing.
  def self.query_dynamo(query_obj)
    Healthtap::NoSql.client.query(query_obj)
  end

  def self.dynamo_table
    Healthtap::NoSql.table_name_for_current_env('external-user-metrics')
  end

  def self.valid_metrics
    METRICS.keys
  end

  def self.metrics_in_category(category)
    out = []
    METRICS.keys.each do |metric|
      if (METRICS[metric]['category'] != nil) && (METRICS[metric]['category'].downcase == category.downcase)
        out << metric
      end
    end
    out
  end

  def self.category_for_metric(metric)
    METRICS[metric]['category'].snakecase.gsub(' ', '_')
  end

  def self.type_for_metric(metric)
    METRICS[metric]['unit_type']
  end

  def self.standard_unit_for_metric(metric)
    METRICS[metric]['unit']
  end

  def self.log_error(error, person_id=nil)
    person_id ||= ''
    log_message = "[#{Time.now.to_s(:db)}] person_id=#{person_id} ERROR: Error in ExternalUserMetrics (#{__FILE__}) : #{error.message}"
    @@logger.error(log_message)
    Healthtap::Graylog::Notifier.connection.notify!({:host => "#{Rails.env.to_s}_external_user_metric", :level => 1, :short_message => log_message})
    # Airbrake.notify(error, {:error_class => 'Exception in ExternalUserMetrics'})
  end

  def self.set_ihealth_code(person)
    return nil if person.ihealth_invite_code.present?
    current_id = GlobalAppAttribute.for('ihealth_invite_codes_number').to_i
    return nil if current_id > 200 && Rails.env.demo?
    return nil if current_id <= 200 && Rails.env.staging?
    return nil if current_id > 1000
    GlobalAppAttribute.set_for('ihealth_invite_codes_number', "#{current_id+1}")
    person.ihealth_invite_code = "healthtap_#{current_id+1}"
  end

end


## DYNAMO QUERYIng EXAMPLES

=begin

{"person_id":1,"source":"Google Fit","metrics": [{"name":"steps","unit":"steps","data":[{"start_ts":1408642563,"value":"500"},{"start_ts":1408650097,"value":"500"}]}, {"name":"blood_type","unit":"none","data":[{"start_ts":1408642563,"value":"A"},{"start_ts":1408650097,"value":"A+"}]} ,{"name":"weight","unit":"kg","data":[{"start_ts":1408650097,"value":"40.0"},{"start_ts":1408650920,"value":"40.0"},{"start_ts":1408651106,"value":"54.3"},{"start_ts":1408653733,"value":"55.1"}]}]}
EXAMPLE DYNAMO QUERIES

client.query({   table_name: 'development-external-user-metrics',   :scan_index_forward=>false, :limit=>1000, key_conditions: {
    'person_id_metric' => {
        comparison_operator: 'EQ',
        attribute_value_list: [
            {:s=> '10152782.0'}
        ]
    },
    'start_ts' => {
        comparison_operator: 'BETWEEN',
        attribute_value_list: [
            {:n => '0'}, {:n=>'140069694303747292152320557'}
        ]
    }
} })


client.query({   table_name: 'development-person-activity',   :scan_index_forward=>false, :limit=>1000, key_conditions: {
    'person_id' => {
        comparison_operator: 'EQ',
        attribute_value_list: [
            {:n=> '10152782.0'}
        ]
    },
    'ts' => {
        comparison_operator: 'BETWEEN',
        attribute_value_list: [
            {:n => '0'}, {:n=>'140069694303747292152320557'}
        ]
    }
} })



client.query({   table_name: 'development-external-user-metrics', :index_name => 'source-start_ts-index', :scan_index_forward=>false, :limit=>1000, key_conditions: {
    'person_id_metric' => {
        comparison_operator: 'EQ',
        attribute_value_list: [
            {:s=> '10152782.0'}
        ]
    },
    'start_ts' => {
        comparison_operator: 'BETWEEN',
        attribute_value_list: [
            {:n => '0'}, {:n=>'140069694303747292152320557'}
        ]
    }
} })


# first lets try to do analytics directly from dynamo
# number of metric per user
client.query({   table_name: 'development-external-user-metrics', :scan_index_forward=>false, :limit=>1000, key_conditions: {
    'person_id_metric' => {
        comparison_operator: 'EQ',
        attribute_value_list: [
            {:s=> '10154084_weight'}
        ]
    },
    'start_ts' => {
        comparison_operator: 'BETWEEN',
        attribute_value_list: [
            {:n => '0'}, {:n=>'140069694303747292152320557'}
        ]
    }
} })


# number of customers who import HK or Googlefit

c1.query({   table_name: 'development-external-user-metrics',# :index_name => 'source-start_ts-index',
                 :count=>true,
    hash_key_value: {
        comparison_operator: 'EQ',
        attribute_value_list: [
            {:s=> 'Google Fit'}
        ]
    },
    range_key_condition: {
        comparison_operator: 'BETWEEN',
        attribute_value_list: [
            {:n => '0'}, {:n=>'140069694303747292152320557'}
        ]
    }
} )


=end

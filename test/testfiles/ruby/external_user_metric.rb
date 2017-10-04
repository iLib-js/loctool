# external_user_metric.rb

require './lib/unit_converter'
require 'ht_graylog'

class ExternalUserMetric < ActiveRecord::Base

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


  ################################### UPDATING DATA


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
      table = NoSql.external_user_metrics_table
      write_to_dynamo(items, table, DYNAMO_BATCH_WRITE_LIMIT)
      update_analytics(items)
      {:result => true, :warnings => error_msg}
    rescue => ex
      log_error(ex, msg_data[:person_id])
      return {:result => false, :error_msg => "We ran into an unaccounted-for case. #{ex.to_s}", :error_msg_localized => Rb.t("We ran into an unaccounted-for case. %{ex}", :variables => {ex: ex.to_s})}
    end
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
end


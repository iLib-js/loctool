require './lib/unit_converter'

class ExternalUserMetric < ActiveRecord::Base

  SEND_EXTERNAL_METRICS = !(Rails.env == 'staging')

  def self.fetch(params)
    if params[:person_id].nil? or Person.where(:id => params[:person_id]).empty?
      error_msg = 'In :fetch : invalid or no person_id provided.'
      localized_error_msg = Rb.t(error_msg) # incorrectly translated -- this should not be picked up by the loctool
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
    if source.downcase == 'kit'
      person.kit_detected = 1
      return {result: true, msg: valid_msg, msg_localized: valid_msg_localized}
    elsif source.downcase == 'google'
      person.googlefit_detected = 1
      return {result: true, msg: valid_msg, msg_localized: valid_msg_localized}
    elsif source.downcase == 's_'
      person.s__detected = 1
      return {result: true, msg: valid_msg, msg_localized: valid_msg_localized}
    elsif source.downcase == 'i'
      person.i_detected = 1
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


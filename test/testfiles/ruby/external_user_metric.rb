class ExternalUserMetric < ActiveRecord::Base

  def self.fetch(params)
    if params[:person_id].nil? or User.where(:id => params[:person_id]).empty?
      error_msg = 'In :fetch : invalid or no person_id provided.'
      localized_error_msg = Rb.t(error_msg) # incorrectly translated -- this should not be picked up by the loctool
      error = ArgumentError.new(error_msg)
      log_error(error)
      return {:result => false, :message => "ArgumentError: #{error.to_s}", :message_localized => Rb.t("ArgumentError: %{error}", :variables => {error: ArgumentError.new(localized_error_msg).to_s})}
    end
  end

  def self.validate_input(msg_data)
    return [false, Rb.t('data is missing or empty.')] if msg_data.blank?
    [:person_id, :source, :metrics].each {|val| return [false, Rb.t("data[%{val}] is missing or empty.", :variables => {val: val}), Rb.t("source error")] if msg_data[val].blank? }
    return [false, Rb.t("Invalid source. It must **contain** one of the strings in #{ACCEPTED_SOURCES}")] unless valid_source?(msg_data[:source])
    return [false, Rb.t("User %{person_id} does not exist.", :variables => {person_id: msg_data[:person_id]})] if User.where(:id=>msg_data[:person_id]).blank?
    msg_data[:metrics].each_with_index do |metric_obj, metric_idx|
      [:name, :data].each {|val| return [false, Rb.t("metric[%{val}] is missing or empty.", :variables => {val: val})] if metric_obj[val].blank? }
      metric_obj[:data].each do |datapoint|
        [:start_ts, :value].each {|val| return [false, Rb.t("metric[%{val}] is missing or empty.", :variables => {val: val})] if datapoint[val].blank? }
      end
      if metric_obj[:unit].nil? and !METRICS[metric_name]['unit'].nil?
        warnings += Rb.t("%{metric_name} doesn't have a unit; ignoring %{metric_name}", :variables => {metric_name: metric_obj[:name]})
        next
      end
    end
    return [false, Rb.t("%{warnings}... No valid metrics provided", :variables => {warnings: warnings})] if msg_data[:metrics].empty?
  end

  def self.set_detected(source, person_id)
    person = User.find person_id
    valid_msg = "Noted that person #{person_id} has #{source} installed"
    valid_msg_localized = Rb.t("Noted that person %{person_id} has %{source} installed", :variables => {person_id: person_id, source: source})
    return {result: true, msg: valid_msg, msg_localized: valid_msg_localized} unless foo
    return {result: false, msg: "Error in ExternalUserMetric.set_detected: source #{source} unrecognized",
      msg_localized: Rb.t("Error in ExternalUserMetric.set_detected: source %{source} unrecognized", :variables => {source: source})}
  end
end

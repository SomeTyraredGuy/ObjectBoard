class BaseError < StandardError
  def user_message
    I18n.t("errors.general.unexpected")
  end

  def status
    :internal_server_error
  end

  def log_error
    Rails.logger.error("#{self.class}: #{message}")
  end
end

class BaseError < StandardError
  def user_message
    I18n.t("errors.general.unexpected")
  end

  def status
    :internal_server_error
  end

  def log_error
    Rails.logger.error("\e[31m#{'=' * 80}\e[0m")
    Rails.logger.error("\e[31m#{self.class}: #{message}\e[0m")
    Rails.logger.error("\e[33mOccurred at: #{Time.current}\e[0m")
    log_backtrace if backtrace
    Rails.logger.error("\e[31m#{'=' * 80}\e[0m")
  end

  private

  def log_backtrace
    Rails.logger.error("Backtrace:\n#{backtrace.select do |line|
      line.include?(Rails.root.to_s)
    end.join("\n")}")
  end
end

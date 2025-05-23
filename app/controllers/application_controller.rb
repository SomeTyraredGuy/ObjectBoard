class ApplicationController < ActionController::Base
  include Pundit::Authorization
  around_action :switch_locale
  after_action :add_csrf_token_to_json_request_header

  rescue_from StandardError, with: :handle_standard_error
  rescue_from BaseError, with: :handle_base_error
  rescue_from Pundit::NotAuthorizedError, with: :handle_not_authorized

  before_action :authenticate_user!
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  def route_not_found
    render json: { error: I18n.t("errors.general.not_found") }, status: :not_found
  end

  protected

  def handle_base_error(error)
    error.log_error

    render json: { error: error.user_message }, status: error.status
  end

  def handle_not_authorized(error)
    Rails.logger.error("#{self.class}: #{error.message}")

    user_message = I18n.t("errors.general.unauthorized")

    render json: { error: user_message }, status: :forbidden
  end

  def handle_standard_error(error)
    Rails.logger.error("#{self.class}: #{error.message}\n#{error.backtrace.join("\n")}")

    user_message = I18n.t("errors.general.unexpected")

    render json: { error: user_message }, status: :internal_server_error
  end

  def default_url_options
    { locale: I18n.locale }
  end

  def switch_locale(&)
    locale = params[:locale] || I18n.locale
    I18n.with_locale(locale, &)
  end

  def add_csrf_token_to_json_request_header
    return unless request.format == :json && !request.get? && protect_against_forgery?

    response.headers["X-CSRF-Token"] = form_authenticity_token
  end
end

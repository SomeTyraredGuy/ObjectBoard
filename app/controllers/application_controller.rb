class ApplicationController < ActionController::Base
  include Pundit::Authorization
  around_action :switch_locale

  rescue_from StandardError, with: :handle_standard_error
  rescue_from BaseError, with: :handle_base_error
  rescue_from Pundit::NotAuthorizedError, with: :handle_not_authorized

  before_action :authenticate_user!
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  protected

  def unprocessable_entity(message = "Something went wrong")
    render json: { message: "Unprocessable entity: #{message}" }, status: :unprocessable_entity
  end

  def handle_base_error(error)
    error.log_error

    respond_to do |format|
      format.json { render json: { error: error.user_message }, status: error.status }
      format.html do
        flash[:alert] = error.user_message
        redirect_back_or_to(root_path)
      end
    end
  end

  def handle_not_authorized(error)
    Rails.logger.error("#{self.class}: #{error.message}")

    user_message = I18n.t("errors.general.unauthorized")

    respond_to do |format|
      format.json { render json: { error: user_message }, status: :forbidden }
      format.html do
        flash[:alert] = user_message
        redirect_back_or_to(root_path)
      end
    end
  end

  def handle_standard_error(error)
    Rails.logger.error("#{self.class}: #{error.message}\n#{error.backtrace.join("\n")}")

    user_message = I18n.t("errors.general.unexpected")

    respond_to do |format|
      format.json { render json: { error: user_message }, status: :internal_server_error }
      format.html do
        flash[:alert] = user_message
        redirect_back_or_to(root_path)
      end
    end
  end

  def default_url_options
    { locale: I18n.locale }
  end

  def switch_locale(&)
    locale = params[:locale] || I18n.default_locale
    I18n.with_locale(locale, &)
  end
end

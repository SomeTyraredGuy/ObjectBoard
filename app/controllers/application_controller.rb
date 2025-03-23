class ApplicationController < ActionController::Base
  include Pundit::Authorization
  around_action :switch_locale

  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

  before_action :authenticate_user!
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  protected

  def not_found
    raise ActionController::RoutingError, "Not Found"
  end

  def unprocessable_entity(message = "Something went wrong")
    render json: { message: "Unprocessable entity: #{message}" }, status: :unprocessable_entity
  end

  def user_not_authorized
    if request.format.json?
      render json: { message: "You are not authorized to perform this action." }, status: :forbidden
    else
      flash[:alert] = "You are not authorized to perform this action."
      redirect_back_or_to(root_path)
    end
  end

  def default_url_options
    { locale: I18n.locale }
  end

  def switch_locale(&action)
    locale = params[:locale] || I18n.default_locale
    I18n.with_locale(locale, &action)
  end
end

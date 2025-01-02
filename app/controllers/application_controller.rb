class ApplicationController < ActionController::Base
  before_action :authenticate_user!
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  protected
  def not_found
    # render file: "#{Rails.root}/public/404.html",  layout: false, status: :not_found
    raise ActionController::RoutingError.new("Not Found")
  end

  def forbidden(message = "You don't have permission to access this resource")
    render json: { message: "Forbidden: " + message }, status: :forbidden
  end

  def not_acceptable(message = "Not acceptable request")
    render json: { message: "Not Acceptable: " + message }, status: :not_acceptable
  end

  def unprocessable_entity(message = "Something went wrong")
    render json: { message: "Unprocessable entity: " + message }, status: :unprocessable_entity
  end
end

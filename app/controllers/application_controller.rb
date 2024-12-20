class ApplicationController < ActionController::Base
  before_action :authenticate_user!
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  protected
  def not_found
    # render file: "#{Rails.root}/public/404.html",  layout: false, status: :not_found
    raise ActionController::RoutingError.new("Not Found")
  end
end

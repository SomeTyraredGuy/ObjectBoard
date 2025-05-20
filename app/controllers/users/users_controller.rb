module Users
  class UsersController < ApplicationController
    skip_before_action :authenticate_user!

    def current
      render json: current_user, status: :ok
    end
  end
end

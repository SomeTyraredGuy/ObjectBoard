module Users
  class SessionsController < Devise::SessionsController
    respond_to :json

    private

    def respond_with(_resource, _opts = {})
      render json: {}, status: :ok
    end

    def respond_to_on_destroy
      render json: {}, status: :ok
    end
  end
end

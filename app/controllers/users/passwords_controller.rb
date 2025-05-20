module Users
  class PasswordsController < Devise::PasswordsController
    respond_to :json

    def update
      self.resource = resource_class.reset_password_by_token(resource_params)
      yield resource if block_given?

      if resource.errors.empty?
        resource.unlock_access! if unlockable?(resource)
        resource.after_database_authentication
        sign_in(resource_name, resource)
        render json: {
          status: { code: 200, message: I18n.t("devise.passwords.updated") }
        }, status: :ok
      else
        render json: {
          status: {
            code: 422,
            message: I18n.t("devise.passwords.update_failed", error: resource.errors.full_messages.join(", "))
          }
        }, status: :unprocessable_entity
      end
    end
  end
end

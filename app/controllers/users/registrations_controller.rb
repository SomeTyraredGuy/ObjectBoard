module Users
  class RegistrationsController < Devise::RegistrationsController
    before_action :configure_sign_up_params, only: [:create]
    before_action :configure_account_update_params, only: [:update]

    respond_to :json

    def create
      build_resource(sign_up_params)

      resource.save
      yield resource if block_given?
      if resource.persisted?
        render json: {}, status: :ok
      else
        render json: { error: resource.errors.full_messages.join(", ") }, status: :unprocessable_entity
      end
    end

    def update
      self.resource = resource_class.to_adapter.get!(send(:"current_#{resource_name}").to_key)

      resource_updated = update_resource(resource, account_update_params)
      yield resource if block_given?
      if resource_updated
        render json: {}, status: :ok
      else
        render json: { error: I18n.t("errors.messages.update_failed") }, status: :unprocessable_entity
      end
    end

    def destroy
      resource.destroy
      Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name)
      yield resource if block_given?
      if resource.destroyed?
        render json: {}, status: :ok
      else
        render json: { error: I18n.t("errors.general.unexpected") }, status: :unprocessable_entity
      end
    end

    protected

    def configure_sign_up_params
      devise_parameter_sanitizer.permit(:sign_up, keys: [:name])
    end

    def configure_account_update_params
      devise_parameter_sanitizer.permit(:account_update, keys: [:name])
    end
  end
end

module RoleErrors
  class NotFound < BaseError
    def user_message
      I18n.t("errors.roles.not_found")
    end

    def status
      :not_found
    end
  end
end

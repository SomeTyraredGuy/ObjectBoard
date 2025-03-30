module MemberErrors
  class NotFound < BaseError
    def user_message
      I18n.t("errors.members.not_found")
    end

    def status
      :not_found
    end
  end

  class CantBeUpdated < BaseError
    def user_message
      I18n.t("errors.members.cant_be_updated")
    end

    def status
      :unprocessable_entity
    end
  end

  class CantBeCreated < BaseError
    def user_message
      I18n.t("errors.members.cant_be_created")
    end

    def status
      :unprocessable_entity
    end
  end

  class AlreadyExists < CantBeCreated
    def user_message
      I18n.t("errors.members.already_exists")
    end
  end

  class OwnerIsImmutable < MemberErrors::CantBeUpdated
    def user_message
      I18n.t("errors.members.owner_is_immutable")
    end
  end
end

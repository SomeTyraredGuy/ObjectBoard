module MemberErrors
  class MemberNotFound < BaseError
    def user_message
      I18n.t("errors.members.not_found")
    end

    def status
      :not_found
    end
  end

  class MemberCantBeUpdated < BaseError
    def user_message
      I18n.t("errors.members.cant_be_updated")
    end

    def status
      :unprocessable_entity
    end
  end

  class MemberCantBeCreated < BaseError
    def user_message
      I18n.t("errors.members.cant_be_created")
    end

    def status
      :unprocessable_entity
    end
  end

  class OwnerIsImmutable < MemberErrors::MemberCantBeUpdated
    def user_message
      I18n.t("errors.members.owner_is_immutable")
    end
  end
end

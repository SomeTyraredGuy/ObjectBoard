module BoardErrors
  class NotFound < BaseError
    def user_message
      I18n.t("errors.boards.not_found")
    end

    def status
      :not_found
    end
  end

  class CantBeCreated < BaseError
    def user_message
      I18n.t("errors.boards.cant_be_created")
    end

    def status
      :unprocessable_entity
    end
  end

  class CantBeUpdated < BaseError
    def user_message
      I18n.t("errors.boards.cant_be_updated")
    end

    def status
      :unprocessable_entity
    end
  end

  class CantBeDeleted < BaseError
    def user_message
      I18n.t("errors.boards.cant_be_deleted")
    end
  end
end

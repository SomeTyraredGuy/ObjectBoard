module CanvasObjectErrors
  class NotFound < BaseError
    def user_message
      I18n.t("errors.canvas_objects.not_found")
    end

    def status
      :not_found
    end
  end

  class GetQueryFailed < NotFound
    def user_message
      I18n.t("errors.canvas_objects.get_query_failed")
    end
  end

  class CantBeUpdated < BaseError
    def user_message
      I18n.t("errors.canvas_objects.cant_be_updated")
    end

    def status
      :unprocessable_entity
    end
  end

  class CanvasObjectIdIsImmutable < CantBeUpdated
  end

  class CantBeCreated < BaseError
    def user_message
      I18n.t("errors.canvas_objects.cant_be_created")
    end

    def status
      :unprocessable_entity
    end
  end

  class MustHaveOneSpecificObject < CantBeCreated
  end

  class CantBeDeleted < BaseError
    def user_message
      I18n.t("errors.canvas_objects.cant_be_deleted")
    end
  end
end

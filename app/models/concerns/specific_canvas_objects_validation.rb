module SpecificCanvasObjectsValidation
  extend ActiveSupport::Concern

  included do
    validates :canvas_object, presence: true
    validates :canvas_object, uniqueness: true
    validate :canvas_object_id_immutable, on: :update

    def handle_update_error
      check_for_canvas_object_id_immutable(errors)

      raise CanvasObjectErrors::CantBeUpdated.new(
        metadata: { specific_object: self, message: errors.full_messages }
      )
    end
  end

  private

  def check_for_canvas_object_id_immutable(errors)
    immutable_error = errors.details[:canvas_object_id].find { |e| e[:error] == :canvas_object_id_immutable }
    return unless immutable_error

    raise CanvasObjectErrors::CanvasObjectIdIsImmutable, immutable_error[:metadata]
  end

  def canvas_object_id_immutable
    return unless canvas_object_id_changed?

    errors.add(:canvas_object_id, :canvas_object_id_immutable,
               metadata: {
                 object: self,
                 new_canvas_object_id: canvas_object_id,
                 old_canvas_object_id: canvas_object_id_was
               })
  end
end

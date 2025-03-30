module CanvasObjectsValidations
  extend ActiveSupport::Concern

  included do
    validates :board, :index, :stroke, :strokeWidth, :opacity, presence: true
    validates :locked, inclusion: { in: [true, false] }
    validates :opacity, inclusion: { in: 0..1 }
    validates :index, :strokeWidth, numericality: { greater_than_or_equal_to: 0 }
    validates :index, uniqueness: { scope: :board_id }
    validate :one_specific_object?

    def handle_create_error
      check_for_one_specific_object(errors)

      raise CanvasObjectErrors::CantBeCreated.new(
        metadata: { canvas_object: self, message: errors.full_messages }
      )
    end
  end

  private

  def check_for_one_specific_object(errors)
    one_specific_object = errors.details[:base].find { |e| e[:error] == :one_specific_object }
    return unless one_specific_object

    raise CanvasObjectErrors::MustHaveOneSpecificObject, one_specific_object[:metadata]
  end

  def one_specific_object?
    specific_shapes = [rectangle, ellipse, text, line].compact
    return if specific_shapes.size == 1 && specific_shapes.first.valid?

    errors.add(:base, :one_specific_object, metadata: { canvas_object: self })
  end
end

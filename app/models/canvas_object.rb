class CanvasObject < ApplicationRecord # rubocop:disable Metrics/ClassLength
  belongs_to :board
  has_one :ellipse, dependent: :destroy
  has_one :rectangle, dependent: :destroy
  has_one :line, dependent: :destroy
  has_one :text, dependent: :destroy

  validate :one_specific_object?
  validates :board, :index, :stroke, :strokeWidth, :opacity, presence: true
  validates :locked, inclusion: { in: [true, false] }
  validates :opacity, inclusion: { in: 0..1 }
  validates :index, :strokeWidth, numericality: { greater_than_or_equal_to: 0 }
  validates :index, uniqueness: { scope: :board_id }

  def self.attrs
    %i[
      index
      locked
      stroke
      strokeWidth
      opacity
    ]
  end

  def self.permitted_attrs
    attrs
      .union(%i[
               id
               type
             ])
      .union(Rectangle.attrs)
      .union(Ellipse.attrs)
      .union(Text.attrs)
      .union(Line.permitted_attrs)
  end

  def self.create_canvas_object(attrs, board_id)
    canvas_object = CanvasObject.new(
      attrs.slice(*CanvasObject.attrs)
        .merge(board_id: board_id)
    )

    type_class = CanvasObject.get_type_class(attrs["type"])
    type_class.new(
      attrs.slice(*type_class.attrs)
        .merge(canvas_object: canvas_object)
    )

    canvas_object
  end

  def self.formatted_with_type(board_id) # rubocop:disable Metrics/MethodLength
    canvas_objects = joins("LEFT JOIN ellipses ON ellipses.canvas_object_id = canvas_objects.id")
                     .joins("LEFT JOIN rectangles ON rectangles.canvas_object_id = canvas_objects.id")
                     .joins("LEFT JOIN lines ON lines.canvas_object_id = canvas_objects.id")
                     .joins("LEFT JOIN texts ON texts.canvas_object_id = canvas_objects.id")
                     .where(canvas_objects: { board_id: board_id })
                     .select(
                       "canvas_objects.*,
        CASE
          WHEN ellipses.canvas_object_id IS NOT NULL THEN 'Ellipse'
          WHEN rectangles.canvas_object_id IS NOT NULL THEN 'Rectangle'
          WHEN lines.canvas_object_id IS NOT NULL THEN 'Line'
          WHEN texts.canvas_object_id IS NOT NULL THEN 'Text'
        END AS type,
        CASE
          WHEN ellipses.canvas_object_id IS NOT NULL THEN to_jsonb(ellipses.*)
          WHEN rectangles.canvas_object_id IS NOT NULL THEN to_jsonb(rectangles.*)
          WHEN lines.canvas_object_id IS NOT NULL THEN to_jsonb(lines.*)
          WHEN texts.canvas_object_id IS NOT NULL THEN to_jsonb(texts.*)
        END AS specific_data"
                     )

    canvas_objects.map do |canvas_object|
      formatted_canvas_object = canvas_object.attributes.symbolize_keys.except(
        :board_id, :created_at, :updated_at, :specific_data
      )
      formatted_canvas_object.merge(canvas_object.specific_data.symbolize_keys.except(:id, :canvas_object_id,
                                                                                      :created_at, :updated_at))
    end
  end

  def update_canvas_object(unfiltered_attrs)
    canvas_object_attrs = unfiltered_attrs.slice(CanvasObject.attrs)

    return if canvas_object_attrs.empty?

    assign_attributes(canvas_object_attrs)
    unprocessable_entity(errors.first.message) unless save
  end

  # returns updated object or nil if no attributes were updated
  def updated_child_object(type, unfiltered_attrs)
    type_class = CanvasObject.get_type_class(type)
    new_attrs = unfiltered_attrs.slice(*type_class.attrs)
    return nil if new_attrs.empty?

    specific_object = get_type_object(type)
    specific_object.assign_attributes(new_attrs)

    unprocessable_entity(specific_object.errors.first.message) unless specific_object.nil? || specific_object.save
  end

  def self.get_type_class(type)
    case type
    when "Rectangle"
      Rectangle
    when "Ellipse"
      Ellipse
    when "Text"
      Text
    when "Line"
      Line
    end
  end

  def get_type_object(type)
    case type
    when "Rectangle"
      rectangle
    when "Ellipse"
      ellipse
    when "Text"
      text
    when "Line"
      line
    end
  end

  private

  def one_specific_object?
    specific_shapes = [rectangle, ellipse, text, line].compact
    return if specific_shapes.size == 1 && specific_shapes.first.valid?

    errors.add(:base, "CanvasObject must have exactly one associated specific object.")
  end
end

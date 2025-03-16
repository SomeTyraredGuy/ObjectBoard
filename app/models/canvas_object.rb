class CanvasObject < ApplicationRecord
  belongs_to :board
  has_one :ellipse, dependent: :destroy
  has_one :rectangle, dependent: :destroy
  has_one :line, dependent: :destroy
  has_one :text, dependent: :destroy

  validate :has_one_specific_object
  validates_presence_of :board, :index, :stroke, :strokeWidth, :opacity
  validates :locked, inclusion: { in: [ true, false ] }
  validates :opacity, inclusion: { in: 0..1 }
  validates :index, :strokeWidth, numericality: { greater_than_or_equal_to: 0 }
  validates_uniqueness_of :index, scope: :board_id

  def self.permitted_attrs
    [
      :id,
      :index,
      :type,
      :locked,
      :stroke,
      :strokeWidth,
      :opacity
    ]
    .union(Rectangle.attrs)
    .union(Ellipse.attrs)
    .union(Text.attrs)
    .union(Line.permitted_attrs)
  end

  def self.create_canvas_object(attrs, board_id)
    canvas_object = CanvasObject.new(
      board_id: board_id,
      index: attrs[:index],
      locked: attrs[:locked],
      stroke: attrs[:stroke],
      strokeWidth: attrs[:strokeWidth],
      opacity: attrs[:opacity],
    )

    case attrs[:type]
    when "Rectangle"
      Rectangle.new(
        attrs
          .slice(*Rectangle.attrs)
          .merge(canvas_object: canvas_object)
      )

    when "Ellipse"
      Ellipse.new(
        attrs
          .slice(*Ellipse.attrs)
          .merge(canvas_object: canvas_object)
      )

    when "Text"
      Text.new(
        attrs
          .slice(*Text.attrs)
          .merge(canvas_object: canvas_object)
      )

    when "Line"
      Line.new(
        attrs
          .slice(*Line.attrs)
          .merge(canvas_object: canvas_object)
      )
    end

    canvas_object
  end

  def self.formatted_with_type(board_id)
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
      p canvas_object if canvas_object.type.nil?
      formatted_canvas_object = canvas_object.attributes.symbolize_keys.except(:board_id, :created_at, :updated_at, :specific_data)
      formatted_canvas_object.merge(canvas_object.specific_data.symbolize_keys.except(:id, :canvas_object_id, :created_at, :updated_at))
    end
  end

  # returns updated object or nil if no attributes were updated
  def updated_canvas_object(type, unfiltered_attrs)
    case type
    when "Rectangle"
      rectangle_attrs = unfiltered_attrs.slice(*Rectangle.attrs)
      return nil if rectangle_attrs.empty?

      specific_object = rectangle
      specific_object.assign_attributes(rectangle_attrs)

    when "Ellipse"
      ellipse_attrs = unfiltered_attrs.slice(*Ellipse.attrs)
      return nil if ellipse_attrs.empty?

      specific_object = ellipse
      specific_object.assign_attributes(ellipse_attrs)

    when "Text"
      text_attrs = unfiltered_attrs.slice(*Text.attrs)
      return nil if text_attrs.empty?

      specific_object = text
      specific_object.assign_attributes(text_attrs)

    when "Line"
      line_attrs = unfiltered_attrs.slice(*Line.attrs)
      return nil if line_attrs.empty?

      specific_object = line
      specific_object.assign_attributes(line_attrs)
    end

    specific_object
  end

  private

  def has_one_specific_object
    specific_shapes = [ rectangle, ellipse, text, line ].compact
    unless specific_shapes.size == 1 && specific_shapes.first.valid?
      errors.add(:base, "CanvasObject must have exactly one associated specific object.")
    end
  end
end

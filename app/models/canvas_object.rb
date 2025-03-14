class CanvasObject < ApplicationRecord
  belongs_to :board
  has_one :ellipse, dependent: :destroy
  has_one :rectangle, dependent: :destroy
  has_one :line, dependent: :destroy
  has_one :text, dependent: :destroy

  validates_presence_of :board, :index, :stroke, :strokeWidth, :opacity
  validates :locked, inclusion: { in: [ true, false ] }

  scope :with_shape_type, -> {
    joins("LEFT JOIN ellipses ON ellipses.canvas_object_id = canvas_objects.id")
    .joins("LEFT JOIN rectangles ON rectangles.canvas_object_id = canvas_objects.id")
    .joins("LEFT JOIN lines ON lines.canvas_object_id = canvas_objects.id")
    .joins("LEFT JOIN texts ON texts.canvas_object_id = canvas_objects.id")
    .select("canvas_objects.*,
             CASE
               WHEN ellipses.canvas_object_id IS NOT NULL THEN 'Ellipse'
               WHEN rectangles.canvas_object_id IS NOT NULL THEN 'Rectangle'
               WHEN lines.canvas_object_id IS NOT NULL THEN 'Line'
               WHEN texts.canvas_object_id IS NOT NULL THEN 'Text'
             END AS type")
  }

  def self.full_attrs
    [
      :id,
      :index,
      :type,
      :locked,
      :opacity,
      :x, :y,
      :width, :height,
      :fill,
      :radiusX, :radiusY,
      :text,
      :stroke, :strokeWidth,
      :opacity,
      :cornerRadius,
      points: []
    ]
  end

  def self.create_canvas_object(attrs, board_id)
    new_object = CanvasObject.new(
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
          canvas_object: new_object,
          x: attrs[:x],
          y: attrs[:y],
          width: attrs[:width],
          height: attrs[:height],
          fill: attrs[:fill],
          cornerRadius: attrs[:cornerRadius]
        )
    when "Ellipse"
        Ellipse.new(
          canvas_object: new_object,
          x: attrs[:x],
          y: attrs[:y],
          radiusX: attrs[:radiusX],
          radiusY: attrs[:radiusY],
          fill: attrs[:fill]
        )
    when "Text"
        Text.new(
          canvas_object: new_object,
          x: attrs[:x],
          y: attrs[:y],
          text: attrs[:text],
          fill: attrs[:fill]
        )
    when "Line"
        Line.new(
          canvas_object: new_object,
          points: attrs[:points]
        )
    end

    new_object
  end

  # returns updated object or nil if no attributes were updated
  def updated_canvas_object(type, unfiltered_attrs)
    case type
    when "Rectangle"
      rectangle_attrs = unfiltered_attrs.slice(:x, :y, :width, :height, :fill, :cornerRadius)
      return nil if rectangle_attrs.empty?

      specific_object = rectangle
      specific_object.assign_attributes(rectangle_attrs)

    when "Ellipse"
      ellipse_attrs = unfiltered_attrs.slice(:x, :y, :radiusX, :radiusY, :fill)
      return nil if rectangle_attrs.empty?

      specific_object = ellipse
      specific_object.assign_attributes(ellipse_attrs)

    when "Text"
      text_attrs = unfiltered_attrs.slice(:x, :y, :text, :fill)
      return nil if rectangle_attrs.empty?

      specific_object = text
      specific_object.assign_attributes(text_attrs)

    when "Line"
      line_attrs = unfiltered_attrs.slice(:points)
      return nil if rectangle_attrs.empty?

      specific_object = line
      specific_object.assign_attributes(line_attrs)
    end

    specific_object
  end
end

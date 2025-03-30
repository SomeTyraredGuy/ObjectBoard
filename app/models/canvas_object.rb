class CanvasObject < ApplicationRecord # rubocop:disable Metrics/ClassLength
  belongs_to :board
  has_one :ellipse, dependent: :destroy
  has_one :rectangle, dependent: :destroy
  has_one :line, dependent: :destroy
  has_one :text, dependent: :destroy

  include CanvasObjectsValidations

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

  def self.formatted_with_type(board_id)
    CanvasObject.all_from_board(board_id).map do |canvas_object|
      formatted_canvas_object = canvas_object.attributes.symbolize_keys.except(
        :board_id, :created_at, :updated_at, :specific_data
      )

      formatted_canvas_object.merge(
        canvas_object.specific_data.symbolize_keys.except(
          :id, :canvas_object_id, :created_at, :updated_at
        )
      )
    end
  end

  def update_canvas_object(unfiltered_attrs)
    canvas_object_attrs = unfiltered_attrs.slice(CanvasObject.attrs)

    return if canvas_object_attrs.empty?

    assign_attributes(canvas_object_attrs)
    return if save

    raise CanvasObjectErrors::CantBeUpdated.new(metadata: { canvas_object: self, new_attrs: canvas_object_attrs })
  end

  def updated_child_object(type, unfiltered_attrs)
    type_class = CanvasObject.get_type_class(type)
    new_attrs = unfiltered_attrs.slice(*type_class.attrs)
    return if new_attrs.empty?

    specific_object = get_type_object(type)
    specific_object.assign_attributes(new_attrs)

    specific_object.handle_update_error unless specific_object.nil? || specific_object.save
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

  def self.find_canvas_object(id)
    canvas_object = CanvasObject.find_by(id: id)
    raise CanvasObjectErrors::NotFound.new(metadata: { id: id }) unless canvas_object

    canvas_object
  end

  def self.all_from_board(board_id) # rubocop:disable Metrics/MethodLength
    begin
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
    rescue ActiveRecord::StatementInvalid => e
      raise CanvasObjectErrors::GetQueryFailed.new(metadata: { error: e.message })
    end

    canvas_objects
  end
end

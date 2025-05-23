class BoardContentSerializer < ActiveModel::Serializer
  attributes :objects

  def objects
    CanvasObject.all_from_board(object.id).map do |canvas_object|
      CanvasObjectSerializer.new(canvas_object)
    end
  end
end

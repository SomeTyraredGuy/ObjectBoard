class BoardContentController < ApplicationController
  include BoardRelated

  def full
    all_canvas_objects = []

    CanvasObject.with_shape_type.where(board_id: @board.id).each do |obj|
      all_canvas_objects.push(obj)
    end

    render json: all_canvas_objects
  end

  def save
    new_params = save_params

    new_IDs = []
    new_params[:create].each do |obj|
      new_IDs.push(create_content obj)
    end unless new_params[:create].blank? || new_params[:create][0].blank?

    new_params[:delete].each do |id|
      delete_content id
    end unless new_params[:delete].blank? || new_params[:delete][0].blank?

    new_params[:update].each do |obj|
      update_content obj
    end unless new_params[:update].blank? || new_params[:update][0].blank?

    render json: {
      assigned_IDs: new_IDs
    }
  end

  private

  def save_params
    params.require(:record).permit(
      create: CanvasObject.full_attrs,
      delete: [],
      update: [
        :id,
        :type,
        newProperties: CanvasObject.full_attrs
      ]
    )
  end

  def create_content(attrs)
    new_object = CanvasObject.create_canvas_object(attrs, @board.id)

    unprocessable_entity(new_object.errors.first.message) unless new_object.save

    new_object.id
  end

  def delete_content(id)
    canvas_object = CanvasObject.find(id)

    user_not_authorized if canvas_object.board != @board

    unprocessable_entity(id.errors.first.message) unless canvas_object.destroy
  end

  def update_content(obj)
    unprocessable_entity("No id in object update") if obj["id"].nil?

    canvas_object = CanvasObject.find(obj["id"])
    unprocessable_entity("Object not found") if canvas_object.nil?

    canvas_object_attrs = obj["newProperties"].slice(:index, :locked, :stroke, :strokeWidth, :opacity)
    canvas_object.assign_attributes(canvas_object_attrs) unless canvas_object_attrs.empty?

    specific_object = canvas_object.updated_canvas_object(obj["type"], obj["newProperties"])

    unprocessable_entity(canvas_object.errors.first.message) unless (canvas_object_attrs.empty? || canvas_object.save) && (specific_object.nil? || specific_object.save)
  end
end

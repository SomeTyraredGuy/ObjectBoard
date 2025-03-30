class BoardContentController < ApplicationController
  include BoardRelated

  def get
    canvas_content = {
      objects: CanvasObject.formatted_with_type(@board.id)
    }

    render json: canvas_content
  end

  def save
    new_params = save_params

    new_ids = []
    ActiveRecord::Base.transaction do
      new_ids = handle_create(new_params[:create])

      handle_delete new_params[:delete]

      handle_update new_params[:update]
    end

    render json: {
      assigned_IDs: new_ids
    }
  end

  private

  def save_params
    params.require(:record).permit(
      create: CanvasObject.permitted_attrs,
      delete: [],
      update: [
        :id,
        :type,
        { newProperties: CanvasObject.permitted_attrs }
      ]
    )
  end

  def handle_create(create_params)
    new_ids = []

    unless create_params.blank? || create_params[0].blank?
      create_params.each do |obj|
        new_ids.push(create_content(obj))
      end
    end

    new_ids
  end

  def create_content(attrs)
    new_object = CanvasObject.create_canvas_object(attrs, @board.id)

    new_object.handle_create_error unless new_object.save

    new_object.id
  end

  def handle_delete(delete_params)
    return if delete_params.blank? || delete_params[0].blank?

    delete_params.each do |id|
      delete_content id
    end
  end

  def delete_content(id)
    canvas_object = CanvasObject.find_canvas_object(id)

    user_not_authorized if canvas_object.board != @board # TODO

    return if canvas_object.destroy

    raise CanvasObjectErrors::CantBeDeleted.new(
      metadata: { canvas_object: canvas_object, message: canvas_object.errors }
    )
  end

  def handle_update(update_params)
    return if update_params.blank? || update_params[0].blank?

    update_params.each do |obj|
      update_content obj
    end
  end

  def update_content(obj)
    canvas_object = CanvasObject.find_canvas_object(obj["id"])

    canvas_object.update_canvas_object(obj["newProperties"])

    canvas_object.updated_child_object(obj["type"], obj["newProperties"])
  end
end

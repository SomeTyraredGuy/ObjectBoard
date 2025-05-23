class CanvasObjectSerializer < ActiveModel::Serializer
  def attributes(*_args)
    all_attributes = object.attributes.symbolize_keys

    excluded_keys = %i[board_id created_at updated_at specific_data canvas_object_id]

    filtered_attributes = all_attributes.except(*excluded_keys)
    specific_attributes_to_merge = object.specific_data.symbolize_keys.except(excluded_keys, :id)

    filtered_attributes.merge!(specific_attributes_to_merge)

    filtered_attributes
  end
end

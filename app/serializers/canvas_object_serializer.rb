class CanvasObjectSerializer < ActiveModel::Serializer
  def attributes(*_args)
    all_attributes = object.attributes.symbolize_keys

    excluded_keys = %i[board_id created_at updated_at specific_data canvas_object_id]

    filtered_attributes = all_attributes.except(*excluded_keys)

    specific_attributes_to_merge = object.specific_data.symbolize_keys.except(excluded_keys, :id)

    CanvasObjectSerializer.convert_enums(object, specific_attributes_to_merge)

    filtered_attributes.merge!(specific_attributes_to_merge)

    filtered_attributes
  end

  def self.convert_enums(object, specific_attributes_to_merge)
    return unless object.type == "Text"

    specific_attributes_to_merge[:align] = Text.aligns.key(specific_attributes_to_merge[:align])
    specific_attributes_to_merge[:verticalAlign] =
      Text.verticalAligns.key(specific_attributes_to_merge[:verticalAlign])
  end
end

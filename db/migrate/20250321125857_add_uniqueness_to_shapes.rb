class AddUniquenessToShapes < ActiveRecord::Migration[8.0]
  def change
    remove_index :ellipses, :canvas_object_id
    add_index :ellipses, :canvas_object_id, unique: true

    remove_index :texts, :canvas_object_id
    add_index :texts, :canvas_object_id, unique: true

    remove_index :lines, :canvas_object_id
    add_index :lines, :canvas_object_id, unique: true

    remove_index :rectangles, :canvas_object_id
    add_index :rectangles, :canvas_object_id, unique: true
  end
end

class AddIndexIndexAndBoardToCanvasObjects < ActiveRecord::Migration[8.0]
  def change
    add_index :canvas_objects, [:index, :board_id], unique: true
  end
end

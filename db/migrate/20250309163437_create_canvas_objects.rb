class CreateCanvasObjects < ActiveRecord::Migration[8.0]
  def change
    create_table :canvas_objects do |t|
      t.references :board, null: false, foreign_key: true

      t.integer :index
      t.boolean :locked
      t.string :stroke
      t.integer :strokeWidth
      t.float :opacity

      t.timestamps
    end
  end
end

class CreateRectangles < ActiveRecord::Migration[8.0]
  def change
    create_table :rectangles do |t|
      t.references :canvas_object, null: false, foreign_key: true
      t.integer :x
      t.integer :y
      t.integer :width
      t.integer :height
      t.string :fill
      t.integer :cornerRadius

      t.timestamps
    end
  end
end

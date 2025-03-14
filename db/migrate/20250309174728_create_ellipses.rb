class CreateEllipses < ActiveRecord::Migration[8.0]
  def change
    create_table :ellipses do |t|
      t.references :canvas_object, null: false, foreign_key: true
      t.integer :x
      t.integer :y
      t.string :fill
      t.integer :radiusX
      t.integer :radiusY

      t.timestamps
    end
  end
end

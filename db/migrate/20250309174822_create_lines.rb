class CreateLines < ActiveRecord::Migration[8.0]
  def change
    create_table :lines do |t|
      t.references :canvas_object, null: false, foreign_key: true
      t.integer :points, array: true

      t.timestamps
    end
  end
end

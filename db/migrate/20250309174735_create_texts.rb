class CreateTexts < ActiveRecord::Migration[8.0]
  def change
    create_table :texts do |t|
      t.references :canvas_object, null: false, foreign_key: true
      t.integer :x
      t.integer :y
      t.string :fill
      t.string :text

      t.timestamps
    end
  end
end

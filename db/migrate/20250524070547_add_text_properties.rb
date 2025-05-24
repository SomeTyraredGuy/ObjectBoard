class AddTextProperties < ActiveRecord::Migration[8.0]
  def change
    add_column :texts, :width, :integer
    add_column :texts, :height, :integer
    add_column :texts, :align, :integer
    add_column :texts, :verticalAlign, :integer
  end
end

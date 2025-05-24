class AddFontSizeToText < ActiveRecord::Migration[8.0]
  def change
    add_column :texts, :fontSize, :integer
  end
end

class IntegerToFloatOnCoordinatesAndLengths < ActiveRecord::Migration[8.0]
  def change
    change_column :ellipses, :x, :float
    change_column :ellipses, :y, :float
    change_column :ellipses, :radiusX, :float
    change_column :ellipses, :radiusY, :float

    change_column :rectangles, :x, :float
    change_column :rectangles, :y, :float
    change_column :rectangles, :width, :float
    change_column :rectangles, :height, :float
    change_column :rectangles, :cornerRadius, :float

    change_column :lines, :points, :float, array: true

    change_column :texts, :x, :float
    change_column :texts, :y, :float
  end
end

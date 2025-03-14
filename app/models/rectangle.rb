class Rectangle < ApplicationRecord
  belongs_to :canvas_object, dependent: :destroy

  validates_presence_of :canvas_object, :x, :y, :width, :height, :fill, :cornerRadius
  validates_uniqueness_of :canvas_object
end

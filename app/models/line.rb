class Line < ApplicationRecord
  belongs_to :canvas_object, dependent: :destroy

  validates_presence_of :canvas_object, :points
  validates_uniqueness_of :canvas_object
end

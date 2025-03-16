class Ellipse < ApplicationRecord
  belongs_to :canvas_object, dependent: :destroy

  validates_presence_of :canvas_object, :x, :y, :radiusX, :radiusY, :fill
  validates_uniqueness_of :canvas_object
  validates :radiusX, :radiusY, numericality: { greater_than_or_equal_to: 0 }

  def self.attrs
    [
      :x, :y,
      :radiusX, :radiusY,
      :fill
    ]
  end
end

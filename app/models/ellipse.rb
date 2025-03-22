class Ellipse < ApplicationRecord
  belongs_to :canvas_object, dependent: :destroy

  validates :canvas_object, :x, :y, :radiusX, :radiusY, :fill, presence: true
  validates :canvas_object, uniqueness: true
  validates :radiusX, :radiusY, numericality: { greater_than_or_equal_to: 0 }

  def self.attrs
    %i[
      x y
      radiusX radiusY
      fill
    ]
  end
end

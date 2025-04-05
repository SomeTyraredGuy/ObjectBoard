class Ellipse < ApplicationRecord
  belongs_to :canvas_object, dependent: :destroy

  include SpecificCanvasObjectsValidation
  validates :x, :y, :radiusX, :radiusY, :fill, presence: true
  validates :radiusX, :radiusY, numericality: { greater_than_or_equal_to: 0 }

  def self.attrs
    %i[
      x y
      radiusX radiusY
      fill
    ]
  end
end

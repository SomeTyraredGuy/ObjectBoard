class Rectangle < ApplicationRecord
  belongs_to :canvas_object, dependent: :destroy

  include SpecificCanvasObjectsValidation
  validates :x, :y, :width, :height, :fill, :cornerRadius, presence: true
  validates :width, :height, :cornerRadius, numericality: { greater_than_or_equal_to: 0 }

  def self.attrs
    %i[
      x y
      width height
      fill
      cornerRadius
    ]
  end
end

class Rectangle < ApplicationRecord
  belongs_to :canvas_object, dependent: :destroy

  validates :canvas_object, :x, :y, :width, :height, :fill, :cornerRadius, presence: true
  validates :canvas_object, uniqueness: true
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

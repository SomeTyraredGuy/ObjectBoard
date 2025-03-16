class Rectangle < ApplicationRecord
  belongs_to :canvas_object, dependent: :destroy

  validates_presence_of :canvas_object, :x, :y, :width, :height, :fill, :cornerRadius
  validates_uniqueness_of :canvas_object
  validates :width, :height, :cornerRadius, numericality: { greater_than_or_equal_to: 0 }

  def self.attrs
    [
      :x, :y,
      :width, :height,
      :fill,
      :cornerRadius
    ]
  end
end

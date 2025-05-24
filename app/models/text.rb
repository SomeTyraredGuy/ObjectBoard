class Text < ApplicationRecord
  enum :align, { left: 0, center: 1, right: 2 }
  enum :verticalAlign, { top: 0, middle: 1, bottom: 2 }

  belongs_to :canvas_object, dependent: :destroy

  include SpecificCanvasObjectsValidation
  validates :x, :y, :text, :fill, :width, :height, :align, :verticalAlign, presence: true

  def self.attrs
    %i[
      x y
      text
      fill
      width height
      align verticalAlign
    ]
  end
end

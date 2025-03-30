class Text < ApplicationRecord
  belongs_to :canvas_object, dependent: :destroy

  include SpecificCanvasObjectsValidation
  validates :x, :y, :text, :fill, presence: true

  def self.attrs
    %i[
      x y
      text
      fill
    ]
  end
end

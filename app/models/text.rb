class Text < ApplicationRecord
  belongs_to :canvas_object, dependent: :destroy

  validates :canvas_object, :x, :y, :text, :fill, presence: true
  validates :canvas_object, uniqueness: true

  def self.attrs
    %i[
      x y
      text
      fill
    ]
  end
end

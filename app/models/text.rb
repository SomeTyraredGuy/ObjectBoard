class Text < ApplicationRecord
  belongs_to :canvas_object, dependent: :destroy

  validates_presence_of :canvas_object, :text, :fontFamily, :fontSize, :fill
  validates_uniqueness_of :canvas_object
end

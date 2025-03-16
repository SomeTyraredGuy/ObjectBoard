class Text < ApplicationRecord
  belongs_to :canvas_object, dependent: :destroy

  validates_presence_of :canvas_object, :x, :y, :text, :fill
  validates_uniqueness_of :canvas_object

  def self.attrs
    [
      :x, :y,
      :text,
      :fill
    ]
  end
end

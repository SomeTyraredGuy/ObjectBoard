class Line < ApplicationRecord
  belongs_to :canvas_object, dependent: :destroy

  validates :canvas_object, :points, presence: true
  validates :canvas_object, uniqueness: true

  def self.attrs
    [
      :points
    ]
  end

  def self.permitted_attrs
    [
      points: []
    ]
  end
end

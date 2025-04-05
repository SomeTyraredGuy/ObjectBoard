class Line < ApplicationRecord
  belongs_to :canvas_object, dependent: :destroy

  include SpecificCanvasObjectsValidation
  validates :points, presence: true

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

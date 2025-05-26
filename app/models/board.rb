class Board < ApplicationRecord
  has_many :members, dependent: :destroy
  has_many :users, through: :members
  has_many :canvas_objects, dependent: :destroy

  validates :name, presence: true, length: { maximum: 25 }
  validates :description, length: { maximum: 255 }
end

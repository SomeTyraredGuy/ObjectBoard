class Board < ApplicationRecord
  has_many :members, dependent: :destroy
  has_many :users, through: :members
  has_many :canvas_objects, dependent: :destroy
end

class Board < ApplicationRecord
  has_many :members
  has_many :users, through: :members
  has_many :canvas_objects
end

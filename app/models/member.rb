class Member < ApplicationRecord
  belongs_to :user
  belongs_to :board
  belongs_to :role
end

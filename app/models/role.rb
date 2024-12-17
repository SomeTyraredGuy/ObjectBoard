class Role < ApplicationRecord
  enum :name, [ :owner, :admin, :editor, :viewer ]
  has_many :members
end

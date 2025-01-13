class Member < ApplicationRecord
  validates :user, presence: { message: "Username is invalid or does not exist" }
  validate :owner_is_immutable, on: :update
  validates :board, :role, presence: { message: "Something went wrong" }
  validates :user, uniqueness: { scope: :board, message: "This user is already member of this board" }

  belongs_to :user
  belongs_to :board
  belongs_to :role

  def owner_is_immutable
    if role.name == "Owner" || @old_role_name == "Owner"
      errors.add(:role, "Owner role cannot be changed")
    end
  end

  def role=(new_role)
    if new_role.nil?
      errors.add(:role, "Role is not valid")
      return
    end

    @old_role_name = Role.find(read_attribute(:role_id)).name unless read_attribute(:role_id).nil?
    write_attribute(:role_id, new_role.id)
  end
end

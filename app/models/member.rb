class Member < ApplicationRecord
  validates :user, presence: { message: "Username is invalid or does not exist" }
  validate :owner_is_immutable, on: :update
  validates :board, :role, presence: { message: "Something went wrong" }
  validates :user, uniqueness: { scope: :board, message: "This user is already member of this board" }

  belongs_to :user
  belongs_to :board
  belongs_to :role

  def owner_is_immutable
    errors.add(:role, "Owner role cannot be changed") if role.name == "Owner" || @old_role_name == "Owner"
  end

  def role=(new_role)
    if new_role.nil?
      errors.add(:role, "Role is not valid")
      return
    end

    @old_role_name = Role.find(self[:role_id]).name unless self[:role_id].nil?
    self[:role_id] = new_role.id
  end

  def format_full # rubocop:disable Metrics/MethodLength
    {
      board_id: board_id,
      member_id: id,
      user_id: user.id,
      name: user.name,
      avatar: "https://i.pinimg.com/736x/a7/23/42/a72342f9852d27544d62573990fa023d.jpg",
      role: {
        name: role.name,
        can_edit: role.can_edit,
        can_change_roles: role.can_change_roles,
        can_assign_admin: role.can_assign_admin,
        can_ignore_rules: role.can_ignore_rules
      }
    }
  end

  def format_restricted
    {
      member_id: id,
      user_id: user.id,
      name: user.name,
      avatar: "https://i.pinimg.com/736x/a7/23/42/a72342f9852d27544d62573990fa023d.jpg",
      role: {
        name: role.name
      }
    }
  end
end

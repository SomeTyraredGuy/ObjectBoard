class Member < ApplicationRecord
  validates :user, presence: { message: "Username is invalid or does not exist" }
  validate :owner_is_immutable, on: :update
  validates :board, :role, presence: {}
  validates :user, uniqueness: { scope: :board, message: I18n.t("errors.members.already_exists") }

  belongs_to :user
  belongs_to :board
  belongs_to :role

  def handle_update_error
    return if errors.blank?

    check_if_already_exists
    check_for_owner_immutable

    raise MemberErrors::CantBeUpdated.new(
      metadata: { member: self, message: errors.full_messages }
    )
  end

  def handle_create_error
    return if errors.blank?

    check_if_already_exists

    raise MemberErrors::CantBeCreated.new(
      metadata: { member: self }
    )
  end

  def check_if_already_exists
    uniqueness_error = errors.details[:user].find { |error| error[:error] == :taken }
    return unless uniqueness_error

    raise MemberErrors::AlreadyExists.new(
      metadata: { user: user, board: board, message: errors.full_messages }
    )
  end

  def check_for_owner_immutable
    owner_is_immutable = errors.details[:role].find { |error| error[:error] == :owner_is_immutable }
    return unless owner_is_immutable

    raise MemberErrors::OwnerIsImmutable, owner_is_immutable[:metadata]
  end

  def owner_is_immutable
    return unless role_id_changed?

    new_role = Role.find_role(id: role_id)
    old_role = Role.find_role(id: role_id_was)
    return unless old_role.name == "Owner" || new_role.name == "Owner"

    errors.add(:role, :owner_is_immutable, metadata: { new_role: new_role, old_role: old_role })
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

  def self.find_member(id)
    member = Member.find_by(id: id)
    raise MemberErrors::NotFound.new(metadata: { member_id: id }) unless member

    member
  end
end

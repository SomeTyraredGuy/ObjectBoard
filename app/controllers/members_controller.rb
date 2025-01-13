class MembersController < ApplicationController
  include BoardRelated

  def current
    render json: format_current(@member, current_user)
  end

  def others
    other_users = []

    @board.members.where.not(user_id: current_user.id).each do |member|
      other_users.push(format_other(member, member.user))
    end

    render json: other_users
  end

  def update_role
    member_to_update = Member.find(params.expect(:member_id)) or not_found
    new_role = params.expect(value: [ :name, :can_edit, :can_change_roles, :can_assign_admin, :can_ignore_rules ])

    record = {
      current_member: @member,
      member_to_update: member_to_update,
      new_role: new_role
    }
    authorize record, policy_class: MemberPolicy

    new_role = Role.find_by(new_role) or not_found

    unprocessable_entity(member_to_update.errors.first.message) unless member_to_update.update(role: new_role)
  end

  def add_to_board
    authorize @member

    new_member_name = params.expect(:value)
    user = User.find_by(email: new_member_name)
    default_role = Role.find_by(name: :Viewer)

    new_member = Member.new(user: user, board: @board, role: default_role)
    unprocessable_entity(new_member.errors.first.message) unless new_member.save
  end

  private

  def format_current(memberDB, userDB)
    {
      board_id: memberDB.board_id,
      member_id: memberDB.id,
      user_id: userDB.id,
      name: userDB.name,
      avatar: "https://i.pinimg.com/736x/a7/23/42/a72342f9852d27544d62573990fa023d.jpg",
      role: {
        name: memberDB.role.name,
        can_edit: memberDB.role.can_edit,
        can_change_roles: memberDB.role.can_change_roles,
        can_assign_admin: memberDB.role.can_assign_admin,
        can_ignore_rules: memberDB.role.can_ignore_rules
      }
    }
  end

  def format_other(memberDB, userDB)
    if @member.role.can_change_roles
      {
        member_id: memberDB.id,
        user_id: userDB.id,
        name: userDB.name,
        avatar: "https://i.pinimg.com/736x/a7/23/42/a72342f9852d27544d62573990fa023d.jpg",
        role: {
          name: memberDB.role.name,
          can_edit: memberDB.role.can_edit,
          can_change_roles: memberDB.role.can_change_roles,
          can_assign_admin: memberDB.role.can_assign_admin,
          can_ignore_rules: memberDB.role.can_ignore_rules
        }
      }
    else
      {
        member_id: memberDB.id,
        user_id: userDB.id,
        name: userDB.name,
        avatar: "https://i.pinimg.com/736x/a7/23/42/a72342f9852d27544d62573990fa023d.jpg",
        role: {
          name: memberDB.role.name
        }
      }
    end
  end
end

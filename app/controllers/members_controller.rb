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

    forbidden("You don't have permission to change roles") unless @member.role.can_change_roles
    forbidden("You don't have permission to assign or change admin") if (new_role[:name] == "Admin" || member_to_update.role.name == "Admin") && !@member.role.can_assign_admin

    new_role = Role.find_by(name: new_role[:name], can_edit: new_role[:can_edit], can_change_roles: new_role[:can_change_roles], can_assign_admin: new_role[:can_assign_admin], can_ignore_rules: new_role[:can_ignore_rules])
    not_acceptable("Role configuration is not valid") if new_role.nil?

    unless member_to_update.update(role: new_role)
      unprocessable_entity(member_to_update.errors.first.message)
    end
  end

  def add_to_board
    new_member_name = params.expect(:value)
    user = User.find_by(email: new_member_name)
    default_role = Role.find_by(name: :Viewer)

    new_member = Member.new(user: user, board: @board, role: default_role)
    render json: new_member.errors, status: :unprocessable_entity unless new_member.save
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

class MembersController < ApplicationController
  include BoardRelated

  def current
    render json: @member.format_full
  end

  def others
    other_users = []
    can_change_roles = @member.role.can_change_roles

    @board.members.where.not(user_id: current_user.id).find_each do |member|
      other_users.push(can_change_roles ? member.format_full : member.format_restricted)
    end

    render json: other_users
  end

  def update_role
    member_to_update = Member.find_member(params.expect(:member_id))

    new_role = params.expect(newRole: %i[name can_edit can_change_roles can_assign_admin can_ignore_rules])

    update_role_authorize new_role, member_to_update

    new_role = Role.find_role(new_role)

    member_to_update.handle_update_error unless member_to_update.update(role: new_role)
  end

  def add_to_board
    authorize @member

    new_member_name = params.expect(:name)
    user = User.find_by(name: new_member_name)
    raise UserErrors::NotFound.new(metadata: { name: new_member_name }) unless user

    default_role = Role.find_by(name: :Viewer)
    raise RoleErrors::NotFound.new(metadata: { name: :Viewer }) unless default_role

    new_member = Member.new(user: user, board: @board, role: default_role)
    return if new_member.save

    new_member.handle_create_error
  end

  private

  def update_role_authorize(new_role, member_to_update)
    context = {
      current_member: @member,
      new_role: new_role.as_json
    }
    record = ApplicationPolicy::PolicyContext.new(
      member_to_update,
      context
    )
    authorize record, :update_role?, policy_class: MemberPolicy
  end
end

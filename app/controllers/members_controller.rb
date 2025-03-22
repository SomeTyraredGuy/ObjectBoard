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
    member_to_update = Member.find(params.expect(:member_id)) or not_found
    new_role = params.expect(value: %i[name can_edit can_change_roles can_assign_admin can_ignore_rules])

    update_role_authorize new_role, member_to_update

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

  def update_role_authorize(new_role, member_to_update)
    context = {
      current_member: @member,
      new_role: new_role.as_json
    }
    record = ApplicationPolicy::PolicyContext.new(
      member_to_update,
      context
    )
    authorize record, policy_class: MemberPolicy
  end
end

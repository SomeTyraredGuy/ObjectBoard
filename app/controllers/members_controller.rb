class MembersController < ApplicationController
  include BoardRelated

  def current
    render json: @member
  end

  def others
    other_users = []

    @board.members.where.not(user_id: current_user.id).find_each do |member|
      other_users.push(member)
    end

    render json: other_users, each_serializer: MemberSerializer
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

    default_role = Role.find_by(name: :Invited)
    raise RoleErrors::NotFound.new(metadata: { name: :Invited }) unless default_role

    new_member = Member.new(user: user, board: @board, role: default_role)
    return if new_member.save

    new_member.handle_create_error
  end

  # Also used for declining an invite
  def leave_board
    if @member.role.name == :Owner
      raise MemberErrors::OwnerIsImmutable.new(metadata: { user: current_user,
                                                           board: @member.board })
    end

    authorize_with_current_member @member

    @member.destroy
  end

  def accept_invite
    authorize_with_current_member @member

    minimal_role = Role.find_by(name: :Viewer)

    @member.handle_update_error unless @member.update(role: minimal_role)
  end

  def kick
    member_to_kick = Member.find_member(params.expect(:member_id))

    if member_to_kick.role.name == :Owner
      raise MemberErrors::OwnerIsImmutable.new(metadata: { user: current_user,
                                                           board: member_to_kick.board })
    end

    authorize_with_current_member member_to_kick

    member_to_kick.destroy
  end

  private

  def authorize_with_current_member(member)
    context = {
      current_member: Member.find_by(user_id: current_user.id, board_id: member.board.id)
    }
    record = ApplicationPolicy::PolicyContext.new(
      member,
      context
    )
    authorize record, :leave_board?, policy_class: MemberPolicy
  end

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

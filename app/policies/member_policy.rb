class MemberPolicy < ApplicationPolicy
  def update_role?
    return false unless @context[:current_member].role.can_change_roles

    return admin_assignable? if admin_assign?

    return false if invited_assign?

    true
  end

  def add_to_board?
    record.role.can_change_roles
  end

  def leave_board?
    return false if @context[:current_member].nil?

    current_user_role = @context[:current_member].role

    return false unless record == @context[:current_member] || current_user_role.can_change_roles

    true
  end

  def kick?
    return false if @context[:current_member].nil?

    current_user_role = @context[:current_member].role

    return false unless current_user_role.can_change_roles

    true
  end

  protected

  def admin_assign?
    @context[:new_role][:name] == "Admin" || record.role.name == "Admin"
  end

  def admin_assignable?
    @context[:current_member].role.can_assign_admin
  end

  def invited_assign?
    @context[:new_role][:name] == "Invited" || record.role.name == "Invited"
  end

  class Scope < ApplicationPolicy::Scope
    # NOTE: Be explicit about which records you allow access to!
    # def resolve
    #   scope.all
    # end
  end
end

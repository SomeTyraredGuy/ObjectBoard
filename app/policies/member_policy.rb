class MemberPolicy < ApplicationPolicy
  def update_role?
    return false unless @context[:current_member].role.can_change_roles

    if @context[:new_role][:name] == "Admin" || record.role.name == "Admin"
      return false unless @context[:current_member].role.can_assign_admin
    end

    true
  end

  def add_to_board?
    record.role.can_change_roles
  end

  class Scope < ApplicationPolicy::Scope
    # NOTE: Be explicit about which records you allow access to!
    # def resolve
    #   scope.all
    # end
  end
end

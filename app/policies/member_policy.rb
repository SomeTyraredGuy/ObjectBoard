class MemberPolicy < ApplicationPolicy
  def update_role?
    false unless record[:current_member].role.can_change_roles

    if record[:new_role][:name] == "Admin" || record[:member_to_update].role.name == "Admin"
      false unless record[:current_member].role.can_assign_admin
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

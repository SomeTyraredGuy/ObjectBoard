class RoleSerializer < ActiveModel::Serializer
  attributes :name, :can_edit, :can_change_roles, :can_assign_admin, :can_ignore_rules
end

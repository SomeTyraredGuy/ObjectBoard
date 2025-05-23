class MemberSerializer < ActiveModel::Serializer
  attributes :member_id, :user_id, :name, :role

  def member_id
    object.id
  end

  def user_id
    object.user.id
  end

  def name
    object.user.name
  end

  def role
    if its_current_user? || can_change_roles?
      RoleSerializer.new(object.role)
    else
      RoleRestrictedSerializer.new(object.role)
    end
  end

  def its_current_user?
    object.user.id == current_user.id
  end

  def can_change_roles?
    object.role.can_change_roles
  end
end

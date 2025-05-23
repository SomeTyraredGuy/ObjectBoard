class BoardSerializer < ActiveModel::Serializer
  attributes :id, :name, :description, :role

  def role
    member = object.members.find_by(user_id: current_user.id)
    return nil unless member

    member.role.name
  end
end

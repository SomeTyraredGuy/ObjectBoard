class BoardContentPolicy < ApplicationPolicy
  def save?
    record.is_a?(Member) && record.role.can_edit
  end

  def belongs?
    record.is_a?(Board) && record.canvas_objects.exists?(id: @context[:canvas_object_id])
  end

  class Scope < ApplicationPolicy::Scope
    # def resolve
    #   scope.all
    # end
  end
end

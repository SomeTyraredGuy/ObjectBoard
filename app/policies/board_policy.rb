class BoardPolicy < ApplicationPolicy
  def access?
    record.present? # record is member
  end

  def edit?
    member = Member.find_by(board: record, user: user)
    member.role.name == :Owner
  end

  def update?
    edit?
  end

  def destroy?
    edit?
  end

  class Scope < ApplicationPolicy::Scope
    def resolve
      scope.joins(:members).where(members: { user: user })
    end
  end
end

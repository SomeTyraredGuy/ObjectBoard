# frozen_string_literal: true

class ApplicationPolicy
  include ApplicationHelper
  attr_reader :user, :context, :record

  class PolicyContext
    attr_accessor :record, :context

    def initialize(record, context)
      @record = record
      @context = context
    end
  end

  def initialize(user, record)
    @user = user

    if record.is_a?(PolicyContext)
      @record = record.record
      @context = record.context
    else
      @record = record
      @context = nil
    end
  end

  def index?
    false
  end

  def show?
    false
  end

  def create?
    false
  end

  def new?
    create?
  end

  def update?
    false
  end

  def edit?
    update?
  end

  def destroy?
    false
  end

  class Scope
    def initialize(user, scope)
      @user = user
      @scope = scope
    end

    def resolve
      raise NoMethodError, "You must define #resolve in #{self.class}"
    end

    private

    attr_reader :user, :scope
  end
end

module ApplicationHelper
  class PolicyContext
    attr_accessor :record, :context

    def initialize(record, context)
      @record = record
      @context = context
    end
  end
end

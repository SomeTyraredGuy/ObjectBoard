require "test_helper"

class BoardContentPolicyTest < ActiveSupport::TestCase
  setup do
    @user = users(:Owner)
  end

  test "save" do
    policy = BoardContentPolicy.new(@user, members(:b1Owner))
    assert policy.save?

    policy = BoardContentPolicy.new(@user, members(:b1Viewer))
    assert_not policy.save?
  end

  test "belongs?" do
    assert policy_for_belongs?(
      boards(:one),
      canvas_objects(:one)
    ).belongs?

    assert_not policy_for_belongs?(
      boards(:one),
      canvas_objects(:b2One)
    ).belongs?
  end

  private

  def policy_for_belongs?(board, canvas_object)
    context = { canvas_object_id: canvas_object.id }
    record = ApplicationPolicy::PolicyContext.new(board, context)
    BoardContentPolicy.new(@user, record)
  end
end

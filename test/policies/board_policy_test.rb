require "test_helper"

class BoardPolicyTest < ActiveSupport::TestCase
  setup do
    @board = boards(:one)
    @user = users(:Owner)
  end

  test "scope" do
    assert_includes Pundit.policy_scope!(@user, Board), @board
    assert_not_includes Pundit.policy_scope!(@user, Board), boards(:two)
  end

  test "access?" do
    assert Pundit.policy!(@user, @board).access?
    assert_not Pundit.policy!(@user, boards(:two)).access?
  end

  test "edit?" do
    assert Pundit.policy!(@user, @board).edit?

    assert_not Pundit.policy!(users(:AdminFull), @board).edit?
  end

  test "update?" do
    assert Pundit.policy!(@user, @board).update?

    assert_not Pundit.policy!(users(:AdminFull), @board).update?
  end

  test "destroy?" do
    assert Pundit.policy!(@user, @board).destroy?

    assert_not Pundit.policy!(users(:AdminFull), @board).destroy?
  end
end

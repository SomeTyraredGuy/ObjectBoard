require "test_helper"

class MemberPolicyTest < ActiveSupport::TestCase
  # include UserContext
  setup do
    @user = users(:Owner)
    @owner = members(:b1Owner)
    @admin_full = members(:b1AdminFull)
    @viewer = members(:b1Viewer)
  end

  class UpdateRoleTest < MemberPolicyTest
    test "member can change role with can_change_roles" do
      context = {
        current_member: @owner,
        new_role: roles(:Editor).as_json
      }
      record = ApplicationPolicy::PolicyContext.new(@viewer, context)
      policy = MemberPolicy.new(@user, record)
      assert policy.update_role?
    end

    test "member can't change role without can_change_roles" do
      context = {
        current_member: @viewer,
        new_role: roles(:Editor).as_json
      }
      record = ApplicationPolicy::PolicyContext.new(@admin_full, context)
      policy = MemberPolicy.new(@user, record)
      assert_not policy.update_role?
    end

    test "admin can be assigned with can_assign_admin" do
      context = {
        current_member: @admin_full,
        new_role: roles(:AdminFull).as_json
      }
      record = ApplicationPolicy::PolicyContext.new(@viewer, context)
      policy = MemberPolicy.new(@user, record)
      assert policy.update_role?
    end

    test "admin role can be changed with can_assign_admin" do
      context = {
        current_member: @admin_full,
        new_role: roles(:Viewer).as_json
      }
      record = ApplicationPolicy::PolicyContext.new(members(:b1AdminFull), context)
      policy = MemberPolicy.new(@user, record)
      assert policy.update_role?
    end

    test "admin can't be assigned without can_assign_admin" do
      context = {
        current_member: @viewer,
        new_role: roles(:AdminFull).as_json
      }
      record = ApplicationPolicy::PolicyContext.new(@viewer, context)
      policy = MemberPolicy.new(@user, record)
      assert_not policy.update_role?
    end

    test "admin can't be changed without can_assign_admin" do
      context = {
        current_member: @viewer,
        new_role: roles(:Viewer).as_json
      }
      record = ApplicationPolicy::PolicyContext.new(@admin_full, context)
      policy = MemberPolicy.new(@user, record)
      assert_not policy.update_role?
    end
  end

  test "add_to_board?" do
    assert Pundit.policy!(@user, @owner).add_to_board?
    assert_not Pundit.policy!(@user, @viewer).add_to_board?
  end
end

require "test_helper"

class MembersControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  setup do
    @board = boards(:one)
    @user = users(:Owner)
    sign_in @user
  end

  test "should get current" do
    get member_current_board_path @board
    assert_response :success

    current = JSON.parse response.body
    assert_equal current["name"], @user.name
  end

  test "should get others" do
    get member_others_board_path @board
    assert_response :success

    current = JSON.parse response.body
    assert_equal 5, current.length
  end

  test "should update role" do
    role = roles(:Editor)
    patch member_update_role_board_path(@board, members(:b1Viewer)), params: { value: {
      name: role.name,
      can_edit: role.can_edit,
      can_change_roles: role.can_change_roles,
      can_assign_admin: role.can_assign_admin,
      can_ignore_rules: role.can_ignore_rules
    } }

    assert_response :success
  end

  test "should add to board" do
    assert_difference("Member.count") do
      post member_add_to_board_board_path(@board), params: { value: users(:NonMember).name }
    end

    assert_response :success
  end

  test "shouldn't add to board twice" do
    assert_no_difference("Member.count") do
      post member_add_to_board_board_path(@board), params: { value: @user.name }
    end
  end
end

require "test_helper"

class MembersControllerTest < ActionDispatch::IntegrationTest
  setup do
    @board = boards(:one)
    @user = users(:Owner)
    sign_in @user
  end

  test "should get current" do
    get current_member_board_url I18n.locale, @board
    assert_response :success

    current = response.parsed_body
    assert_equal current["name"], @user.name
  end

  test "should get others" do
    get others_members_board_path I18n.locale, @board
    assert_response :success

    current = response.parsed_body
    assert_equal 5, current.length
  end

  test "should update role" do
    role = roles(:Editor)
    patch member_update_role_board_path(I18n.locale, @board, members(:b1Viewer)), params: { newRole: {
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
      post member_add_to_board_board_path(I18n.locale, @board), params: { name: users(:NonMember).name }
    end

    assert_response :success
  end

  test "shouldn't add to board twice" do
    assert_no_difference("Member.count") do
      post member_add_to_board_board_path(I18n.locale, @board), params: { name: @user.name }
    end
  end

  test "should leave board" do
    assert_difference("Member.count", -1) do
      delete member_leave_board_board_path(I18n.locale, @board)
    end

    assert_response :success
  end

  test "should accept invite" do
    post member_accept_invite_board_path(I18n.locale, boards(:with_invite))

    assert_response :success
  end
end

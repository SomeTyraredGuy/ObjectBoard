require "test_helper"

class BoardsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  setup do
    @board = boards(:one)
    @user = users(:Owner)
    sign_in @user
  end

  test "should create board" do
    assert_difference("Board.count") do
      post boards_url, params: { board: { description: @board.description, name: @board.name } }
    end
  end

  test "should show board" do
    get board_url(I18n.locale, @board)
    assert_response :success
  end

  test "should get all boards" do
    get boards_all_url
    assert_response :success
    assert_equal @user.boards.count, response.parsed_body.length
  end

  class DestroyTest < BoardsControllerTest
    test "owner should destroy board" do
      assert_difference("Board.count", -1) do
        delete board_url(I18n.locale, @board)
      end

      assert_response :no_content
    end

    test "admins can't destroy board" do
      assert_cant_delete_board users(:AdminMinimal)

      assert_cant_delete_board users(:Admin2)

      assert_cant_delete_board users(:AdminFull)

      get board_url(I18n.locale, @board)
      assert_response :success
    end

    test "editors can't destroy board" do
      assert_cant_delete_board users(:Editor)

      get board_url(I18n.locale, @board)
      assert_response :success
    end

    test "viewers can't destroy board" do
      assert_cant_delete_board users(:Viewer)

      get board_url(I18n.locale, @board)
      assert_response :success
    end
  end

  class UpdateTest < BoardsControllerTest
    test "should update board" do
      patch board_url(I18n.locale, @board), params: { board: { description: @board.description, name: @board.name } }

      assert_response :no_content
    end

    test "Admins can't update board" do
      assert_cant_update_board users(:AdminMinimal)

      assert_cant_update_board users(:Admin2)

      assert_cant_update_board users(:AdminFull)
    end

    test "Editors can't update board" do
      assert_cant_update_board users(:Editor)
    end

    test "Viewers can't update board" do
      assert_cant_update_board users(:Viewer)
    end
  end

  private

  def assert_cant_delete_board(user)
    sign_in user
    assert_no_difference("Board.count") do
      delete board_url(I18n.locale, @board)
    end
  end

  def assert_cant_update_board(user)
    sign_in user
    patch board_url(I18n.locale, @board), params: { board: { description: @board.name } }
    assert_response :forbidden
    assert_not_equal @board.name, @board.description
  end

  def assert_redirected_to_login_page
    assert_redirected_to new_user_session_url
  end
end

require "test_helper"

class BoardsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  setup do
    @board = boards(:one)
    sign_in users(:Owner)
  end

  class IndexTest < BoardsControllerTest
    test "should get index" do
      get boards_url
      assert_response :success
    end

    test "index should contain only boards user can access" do
      get boards_url
      assert_response :success
      assert_select "p.boardNameTest", count: 1
      assert_select "p.boardNameTest", text: @board.name
    end
  end

  test "should get new" do
    get new_board_url
    assert_response :success
  end

  test "should create board" do
    assert_difference("Board.count") do
      post boards_url, params: { board: { description: @board.description, name: @board.name } }
    end

    assert_redirected_to board_url(Board.last, locale: I18n.locale)
  end

  test "should show board" do
    get board_url(@board)
    assert_response :success
  end

  class DestroyTest < BoardsControllerTest
    test "owner should destroy board" do
      assert_difference("Board.count", -1) do
        delete board_url(@board)
      end

      assert_redirected_to boards_url(locale: I18n.locale)
    end

    test "admins can't destroy board" do
      assert_cant_delete_board users(:AdminMinimal)

      assert_cant_delete_board users(:Admin2)

      assert_cant_delete_board users(:AdminFull)

      get board_url(@board)
      assert_response :success
    end

    test "editors can't destroy board" do
      assert_cant_delete_board users(:Editor)

      get board_url(@board)
      assert_response :success
    end

    test "viewers can't destroy board" do
      assert_cant_delete_board users(:Viewer)

      get board_url(@board)
      assert_response :success
    end
  end

  class EditTest < BoardsControllerTest
    test "should get edit" do
      get edit_board_url(@board)
      assert_response :success
    end

    test "Admins can't open edit board page" do
      assert_cant_open_edit_board_page users(:AdminMinimal)

      assert_cant_open_edit_board_page users(:Admin2)

      assert_cant_open_edit_board_page users(:AdminFull)
    end

    test "Editors can't open edit board page" do
      assert_cant_open_edit_board_page users(:Editor)
    end

    test "Viewers can't open edit board page" do
      assert_cant_open_edit_board_page users(:Viewer)
    end
  end

  class UpdateTest < BoardsControllerTest
    test "should update board" do
      patch board_url(@board), params: { board: { description: @board.description, name: @board.name } }
      assert_redirected_to board_url(@board, locale: I18n.locale)
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

  test "should redirect unauthorized user to login page" do
    sign_out users(:Owner)

    get boards_url
    assert_redirected_to_login_page

    get new_board_url
    assert_redirected_to_login_page

    get edit_board_url(@board)
    assert_redirected_to_login_page

    get board_url(@board)
    assert_redirected_to_login_page

    post boards_url, params: { board: { description: @board.description, name: @board.name } }
    assert_redirected_to_login_page

    patch board_url(@board), params: { board: { description: @board.description, name: @board.name } }
    assert_redirected_to_login_page

    delete board_url(@board)
    assert_redirected_to_login_page
  end

  private

  def assert_cant_delete_board(user)
    sign_in user
    assert_no_difference("Board.count") do
      delete board_url(@board)
    end
  end

  def assert_cant_open_edit_board_page(user)
    sign_in user
    get edit_board_url(@board)
    assert_redirected_to root_url(locale: I18n.locale)
  end

  def assert_cant_update_board(user)
    sign_in user
    patch board_url(@board), params: { board: { description: @board.name } }
    assert_redirected_to root_url(locale: I18n.locale)
    assert_not_equal @board.name, @board.description
  end

  def assert_redirected_to_login_page
    assert_redirected_to new_user_session_url
  end
end

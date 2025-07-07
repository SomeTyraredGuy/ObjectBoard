require "test_helper"

class UsersControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:Owner)
    sign_in @user
  end

  test "should get current user" do
    get current_user_url(I18n.locale, @board)

    assert_response :success
    assert_equal @user.id, JSON.parse(@response.body)["id"]
  end
end

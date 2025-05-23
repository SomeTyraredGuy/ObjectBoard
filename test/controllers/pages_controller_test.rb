require "test_helper"

class PagesControllerTest < ActionDispatch::IntegrationTest
  test "should get root and it should be home page" do
    get root_path
    assert_response :success
    assert_routing root_path, controller: "pages", action: "app", locale: I18n.locale.to_s
  end
end

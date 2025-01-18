require "test_helper"

class PagesControllerTest < ActionDispatch::IntegrationTest
  test "should get root and it should be home page" do
    get root_path
    assert_response :success
    assert_routing root_path, controller: "pages", action: "home"
  end

  test "should get pricing" do
    get pricing_path
    assert_response :success
  end
end

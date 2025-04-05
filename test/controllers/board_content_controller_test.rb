require "test_helper"

class BoardContentControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers
  setup do
    @board = boards(:one)
    @user = users(:Owner)
    sign_in @user

    @canvas_object = canvas_objects(:three) # Rectangle
    @rectangle = rectangles(:one)
  end

  test "should get all content in board" do
    get content_get_board_path @board

    resp = response.parsed_body
    assert_response :success
    assert_equal 4, resp["objects"].length
  end

  test "should save new object" do
    setup_new_rectangle

    assert_difference("CanvasObject.count") do
      post content_save_board_path(@board), params: {
        record: {
          create: [
            @new_rectangle
          ],
          delete: [],
          update: []
        }
      }
    end

    assert_response :success
  end

  test "should respond with assigned indexes to new objects" do
    setup_new_rectangle

    post content_save_board_path(@board), params: {
      record: {
        create: [
          @new_rectangle
        ],
        delete: [],
        update: []
      }
    }

    assert_response :success

    resp = response.parsed_body
    assert_not_nil resp["assigned_IDs"]
    assert_equal resp["assigned_IDs"].length, 1
    assert_not_nil CanvasObject.find_by(id: resp["assigned_IDs"][0])
  end

  test "should delete object" do
    assert_difference("CanvasObject.count", -1) do
      post content_save_board_path(@board), params: {
        record: {
          create: [],
          delete: [
            @canvas_object.id
          ],
          update: []
        }
      }
    end
  end

  test "should update object" do
    new_width = @rectangle.width * 2

    post content_save_board_path(@board), params: {
      record: {
        create: [],
        delete: [],
        update: [
          {
            id: @canvas_object.id,
            type: "Rectangle",
            newProperties: {
              width: new_width
            }
          }
        ]
      }
    }

    assert_response :success
    assert_equal new_width, Rectangle.find(@rectangle.id).width
  end

  private

  def setup_new_rectangle
    @new_rectangle = @rectangle.attributes.merge(@rectangle.canvas_object.attributes)
                               .symbolize_keys.slice(*CanvasObject.permitted_attrs)
    @new_rectangle[:index] = CanvasObject.maximum(:index).to_i + 1
    @new_rectangle[:id] = -1
    @new_rectangle[:type] = "Rectangle"
  end
end

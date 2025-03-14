require "test_helper"

class BoardContentControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers
  setup do
    @board = boards(:one)
    @user = users(:Owner)
    sign_in @user

    @canvas_object = canvas_objects(:three) # Rectangle
    @rectangle = rectangles(:one)
    @new_rectangle = {
      id: -1,
      index: 0,
      type: "Rectangle",
      locked: false,
      stroke: "#000000",
      strokeWidth: 2,
      fill: "transparent",
      opacity: 1,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      cornerRadius: 0
    }
  end

  test "should get all content in board" do
    get content_full_board_path @board

    assert_response :success
    assert_equal 4, JSON.parse(response.body).length
  end

  test "should save new object" do
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

    resp = JSON.parse(response.body)
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
end

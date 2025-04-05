require "test_helper"

# Tests for common functionality of CanvasObjects children
class SpecificCanvasObjectTest < ActiveSupport::TestCase
  test "canvas_object_id is immutable" do
    line = lines(:one)
    line.canvas_object = canvas_objects(:one)
    assert line.invalid?

    assert_raises CanvasObjectErrors::CanvasObjectIdIsImmutable do
      line.save
      line.handle_update_error
    end
  end
end

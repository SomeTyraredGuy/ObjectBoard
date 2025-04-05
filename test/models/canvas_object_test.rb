require "test_helper"

class CanvasObjectTest < ActiveSupport::TestCase
  test "exactly one specific object must exist" do
    canvas_object = canvas_objects(:one).dup
    canvas_object.index = CanvasObject.maximum(:index).to_i + 1
    assert canvas_object.invalid?

    assert_raises CanvasObjectErrors::MustHaveOneSpecificObject do
      canvas_object.save
      canvas_object.handle_create_error
    end

    line = lines(:one).dup
    line.canvas_object = canvas_object
    assert canvas_object.valid?

    rect = rectangles(:one).dup
    rect.canvas_object = canvas_object
    assert canvas_object.invalid?
  end
end

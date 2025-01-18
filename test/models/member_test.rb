require "test_helper"

class MemberTest < ActiveSupport::TestCase
  test "owner is immutable" do
    owner = members(:b1Owner)
    owner.role = roles(:AdminFull)
    assert owner.invalid?

    nonOwner = members(:b1AdminFull)
    nonOwner.role = roles(:Owner)
    assert nonOwner.invalid?
  end

  test "role changes correctly" do
    member = members(:b1AdminFull)
    member.role = roles(:Editor)

    assert member.save
    assert_equal member.role.name, "Editor"
  end
end

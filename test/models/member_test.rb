require "test_helper"

class MemberTest < ActiveSupport::TestCase
  test "owner is immutable" do
    owner = members(:b1Owner)
    owner.role = roles(:AdminFull)
    assert owner.invalid?

    non_owner = members(:b1AdminFull)
    non_owner.role = roles(:Owner)
    assert non_owner.invalid?

    assert_raises MemberErrors::OwnerIsImmutable do
      non_owner.save
      non_owner.handle_update_error
    end
  end

  test "role changes correctly" do
    member = members(:b1AdminFull)
    member.role = roles(:Editor)

    assert member.save
    assert_equal member.role.name, "Editor"
  end

  test "shouldn't create two members for one user within one board" do
    new_member = members(:b1Owner).dup

    assert_raises MemberErrors::AlreadyExists do
      new_member.save
      new_member.handle_create_error
    end
  end
end

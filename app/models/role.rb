class Role < ApplicationRecord
  before_validation :set_defaults

  enum :name, [ :owner, :admin, :editor, :viewer ]
  has_many :members


  private

  def set_defaults
    self.can_edit = false if self.can_edit.blank?
    self.can_change_roles = false if self.can_change_roles.blank?
    self.can_assign_admin = false if self.can_assign_admin.blank?
    self.can_delete = false if self.can_delete.blank?
  end
end

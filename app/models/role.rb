class Role < ApplicationRecord
  before_validation :set_defaults

  enum :name, { Owner: 0, Admin: 1, Editor: 2, Viewer: 3 }
  has_many :members, dependent: nil

  def self.find_role(role_attrs)
    role = Role.find_by(role_attrs)
    raise RoleErrors::NotFound(metadata: { role: role_attrs }) unless role

    role
  end

  private

  def set_defaults
    self.can_edit = false if can_edit.blank?
    self.can_change_roles = false if can_change_roles.blank?
    self.can_assign_admin = false if can_assign_admin.blank?
    self.can_ignore_rules = false if can_ignore_rules.blank?
  end
end

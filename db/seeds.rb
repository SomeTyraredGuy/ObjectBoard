# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

Role.create(id: 1, name: :owner, can_edit: true, can_change_roles: true, can_assign_admin: true, can_delete: true)

Role.create(id: 2, name: :admin, can_edit: true, can_change_roles: true, can_assign_admin: false, can_delete: false)
Role.create(id: 3, name: :admin, can_edit: true, can_change_roles: true, can_assign_admin: true, can_delete: false)
Role.create(id: 4, name: :admin, can_edit: true, can_change_roles: true, can_assign_admin: false, can_delete: true)
Role.create(id: 5, name: :admin, can_edit: true, can_change_roles: true, can_assign_admin: true, can_delete: true)

Role.create(id: 6, name: :editor, can_edit: true, can_change_roles: false, can_assign_admin: false, can_delete: false)

Role.create(id: 7, name: :viewer, can_edit: false, can_change_roles: false, can_assign_admin: false, can_delete: false)

password = 'qweqwe'
emails = [ '1@1', '2@2' ]
emails.each do |email|
  user = User.new
  user.email = email
  user.password = password
  user.password_confirmation = password
  user.save!
end

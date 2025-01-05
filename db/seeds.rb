# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

Role.create(id: 1, name: :Owner, can_edit: true, can_change_roles: true, can_assign_admin: true, can_ignore_rules: true)

Role.create(id: 2, name: :Admin, can_edit: true, can_ignore_rules: true)
Role.create(id: 3, name: :Admin, can_edit: true, can_ignore_rules: true, can_change_roles: true)
Role.create(id: 4, name: :Admin, can_edit: true, can_ignore_rules: true, can_change_roles: true, can_assign_admin: true)

Role.create(id: 5, name: :Editor, can_edit: true)

Role.create(id: 6, name: :Viewer)

password = 'qweqwe'
emails = [ '1@1', '2@2', '3@3', '4@4', '5@5', '6@6', '7@7', '8@8', '9@9', '10@10' ]
names = [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '10' ]
emails.each_with_index do |email, index|
  user = User.new
  user.name = names[index]
  user.email = email
  user.password = password
  user.password_confirmation = password
  user.save!
end

Board.create(name: 'test', description: 'test')
Member.create(user_id: 1, board_id: 1, role_id: 1)
Member.create(user_id: 2, board_id: 1, role_id: 2)
Member.create(user_id: 3, board_id: 1, role_id: 3)
Member.create(user_id: 4, board_id: 1, role_id: 4)
Member.create(user_id: 5, board_id: 1, role_id: 5)
Member.create(user_id: 6, board_id: 1, role_id: 6)

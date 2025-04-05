class AddRoleToMember < ActiveRecord::Migration[8.0]
  def change
    add_reference :members, :role, null: false, foreign_key: true
  end
end

class CreateRoles < ActiveRecord::Migration[8.0]
  def change
    create_table :roles do |t|
      t.integer :name
      t.boolean :can_edit
      t.boolean :can_change_roles
      t.boolean :can_assign_admin
      t.boolean :can_delete

      t.timestamps
    end
  end
end

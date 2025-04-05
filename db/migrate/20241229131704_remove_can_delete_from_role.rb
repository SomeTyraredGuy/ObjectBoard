class RemoveCanDeleteFromRole < ActiveRecord::Migration[8.0]
  def change
    remove_column :roles, :can_delete, :boolean
  end
end

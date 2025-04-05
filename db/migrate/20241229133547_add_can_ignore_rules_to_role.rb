class AddCanIgnoreRulesToRole < ActiveRecord::Migration[8.0]
  def change
    add_column :roles, :can_ignore_rules, :boolean
  end
end

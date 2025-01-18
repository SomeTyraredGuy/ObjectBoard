class MakeUserNameAndEmailUnique < ActiveRecord::Migration[8.0]
  def change
    add_index :users, [ :name, :email ], unique: true
  end
end

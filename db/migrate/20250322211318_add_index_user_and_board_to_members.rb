class AddIndexUserAndBoardToMembers < ActiveRecord::Migration[8.0]
  def change
    add_index :members, [:user_id, :board_id], unique: true
  end
end

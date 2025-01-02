module BoardRelated
  extend ActiveSupport::Concern

  included do
    if controller_name == "boards"
      before_action :set_board, except: %i[index new create]
    else
      before_action :set_board
    end
  end

  private

  def set_board
    # ALSO checks if user is member of the board
    @board = Board.find(params.expect(:id)) or not_found
    @member = Member.find_by(board: @board, user: current_user) or not_found
  end
end

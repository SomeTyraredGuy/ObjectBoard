module BoardRelated
  extend ActiveSupport::Concern

  included do
    if controller_name == "boards"
      before_action :set_board, except: %i[index new create] # rubocop:disable Rails/LexicallyScopedActionFilter
    else
      before_action :set_board
    end
  end

  private

  def set_board
    @board = Board.find_by(id: params.expect(:id))
    raise BoardErrors::NotFound.new(metadata: { board_id: params.expect(:id) }) unless @board

    @member = Member.find_by(board: @board, user: current_user)
    raise MemberErrors::NotFound.new(metadata: { board_id: @board.id, user_id: current_user.id }) unless @member
    authorize @board, :access?
  end
end

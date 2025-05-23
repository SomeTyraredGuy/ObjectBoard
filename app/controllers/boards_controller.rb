class BoardsController < ApplicationController
  include BoardRelated

  def all
    render json: policy_scope(Board)
  end

  def one
    render json: @board
  end

  # POST /boards or /boards.json
  def create
    @board = Board.new(board_params)
    save_board!

    render json: {}, status: :created
  end

  # PATCH/PUT /boards/1 or /boards/1.json
  def update
    authorize @board

    update_board!
  end

  # DELETE /boards/1 or /boards/1.json
  def destroy
    authorize @board

    destroy_board!

    head :no_content
  end

  private

  def board_params
    params.expect(board: %i[name description])
  end

  def create_owner
    @member = Member.new(board: @board, user: current_user, role: Role.find_by(name: :Owner))
  end

  def save_board!
    create_owner

    ActiveRecord::Base.transaction do
      @board.save!
      @member.save!
    end
  rescue ActiveRecord::RecordInvalid => e
    raise BoardErrors::CantBeCreated.new(metadata: { board: @board, owner: @member, message: e.message })
  end

  def destroy_board!
    return if @board.destroy

    raise BoardErrors::CantBeDeleted.new(metadata: { board: @board, message: @board.message })
  end

  def update_board!
    return if @board.update(board_params)

    raise BoardErrors::CantBeUpdated.new(metadata: { board: @board, message: @board.errors })
  end
end

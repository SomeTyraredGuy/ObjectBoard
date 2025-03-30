class BoardsController < ApplicationController
  include BoardRelated

  # GET /boards or /boards.json
  def index
    @boards = policy_scope(Board)
  end

  # GET /boards/1 or /boards/1.json
  def show
    render layout: "board"
  end

  # GET /boards/new
  def new
    @board = Board.new
  end

  # GET /boards/1/edit
  def edit
    authorize @board
  end

  # POST /boards or /boards.json
  def create
    @board = Board.new(board_params)
    save_board!

    respond_to do |format|
      format.html { redirect_to @board, notice: "Board was successfully created." }
      format.json { render :show, status: :created, location: @board }
    end
  end

  # PATCH/PUT /boards/1 or /boards/1.json
  def update
    authorize @board

    update_board!

    respond_to do |format|
      format.html { redirect_to @board, notice: "Board was successfully updated." }
      format.json { render :show, status: :ok, location: @board }
    end
  end

  # DELETE /boards/1 or /boards/1.json
  def destroy
    authorize @board

    destroy_board!

    respond_to do |format|
      format.html { redirect_to boards_path, status: :see_other, notice: "Board was successfully destroyed." }
      format.json { head :no_content }
    end
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

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
    @member = Member.new(board: @board, user: current_user, role: Role.find_by(name: :Owner))

    respond_to do |format|
      if @board.save
        unless @member.save
          format.html { render :new, status: :unprocessable_entity }
          format.json { render json: @member.errors, status: :unprocessable_entity }
        end
        format.html { redirect_to @board, notice: "Board was successfully created." }
        format.json { render :show, status: :created, location: @board }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @board.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /boards/1 or /boards/1.json
  def update
    authorize @board
    respond_to do |format|
      if @board.update(board_params)
        format.html { redirect_to @board, notice: "Board was successfully updated." }
        format.json { render :show, status: :ok, location: @board }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @board.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /boards/1 or /boards/1.json
  def destroy
    authorize @board

    @board.members.destroy_all
    @board.destroy!

    respond_to do |format|
      format.html { redirect_to boards_path, status: :see_other, notice: "Board was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    def board_params
      params.expect(board: [ :name, :description ])
    end
end

class BoardsController < ApplicationController
  before_action :set_board, expect: %i[ index new create]

  # GET /boards or /boards.json
  def index
    @boards = current_user.boards
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
  end

  # POST /boards or /boards.json
  def create
    @board = Board.new(board_params)
    @member = Member.new(board: @board, user: current_user, role: Role.find_by(name: :owner))

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
    unless @member.role.can_delete
      return
    end

    @board.members.destroy_all
    @board.destroy!

    respond_to do |format|
      format.html { redirect_to boards_path, status: :see_other, notice: "Board was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  def user
    member_user = member_user_by_id(params[:id_member].to_i)
    render json: format_user(member_user[0], member_user[1])
  end

  def other_users
    other_users = []

    @board.members.where.not(user_id: current_user.id).each do |member|
      other_users.push(format_user(member, member.user))
    end

    render json: other_users
  end

  private

    def set_board
      # ALSO checks if user is member of the board
      @board = Board.find(params.expect(:id)) or not_found
      @member = Member.find_by(board: @board, user: current_user) or not_found
    end

    # Only allow a list of trusted parameters through.
    def board_params
      params.expect(board: [ :name, :description ])
    end

    def format_user(memberDB, userDB)
      {
        member_id: memberDB.id,
        user_id: userDB.id,
        email: userDB.email,
        avatar: "https://i.pinimg.com/736x/a7/23/42/a72342f9852d27544d62573990fa023d.jpg",
        role: memberDB.role
      }
    end

    def member_user_by_id(member_id)
      if @member != nil && @member.id == member_id
        memberDB = @member
        userDB = @member.user
      else
        memberDB = Member.find_by_id(member_id)
        userDB = User.find_by_id(memberDB.user_id)
      end

      return memberDB, userDB
    end
end

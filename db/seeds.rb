def create_user(password)
  User.create(
    name: Faker::Name.name,
    email: Faker::Internet.email,
    password: password,
    password_confirmation: password
  )
end

def create_board
  Board.create(
    name: Faker::Lorem.word,
    description: Faker::Lorem.paragraph_by_chars(number: 200),
  )
end

def create_owner
  Member.create(
    user_id: User.all.sample.id,
    board_id: create_board.id,
    role_id: Role.find_by(name: :Owner).id
  )
end

def create_member
  Member.create(
    user_id: User.all.sample.id,
    board_id: Board.all.sample.id,
    role_id: Role.all.sample.id
  )
end

def create_canvas_object
  board = Board.all.sample
  next_index = (board.canvas_objects.maximum(:index) || -1) + 1
  CanvasObject.new(
    board_id: board.id,
    index: next_index,
    locked: [true, false].sample,
    stroke: Faker::Color.hex_color,
    strokeWidth: rand(1..10),
    opacity: rand(0.4..1.0).round(2)
  )
end

def create_text
  canvas_object = create_canvas_object
  Text.new(
    canvas_object: canvas_object,
    text: Faker::Lorem.paragraph_by_chars(number: 10),
    x: rand(0..1000),
    y: rand(0..1000),
    width: rand(50..300),
    height: rand(50..300),
    fill: Faker::Color.hex_color,
    align: rand(0..2), # 0: left, 1: center, 2: right
    verticalAlign: rand(0..2), # 0: top, 1: middle, 2: bottom
    fontSize: rand(12..36)
  )
  canvas_object.save!
end

def create_rectangle
  canvas_object = create_canvas_object
  Rectangle.new(
    canvas_object: canvas_object,
    x: rand(0..1000),
    y: rand(0..1000),
    width: rand(50..300),
    height: rand(50..300),
    fill: Faker::Color.hex_color,
    cornerRadius: rand(0..0.15)
  )
  canvas_object.save!
end

def create_line
  canvas_object = create_canvas_object
  Line.new(
    canvas_object: canvas_object,
    points: Array.new(4) { rand(0..1000) } # 4 random points for a line
  )
  canvas_object.save!
end

def create_ellipse
  canvas_object = create_canvas_object
  Ellipse.new(
    canvas_object: canvas_object,
    x: rand(0..1000),
    y: rand(0..1000),
    radiusX: rand(50..300),
    radiusY: rand(50..300),
    fill: Faker::Color.hex_color
  )
  canvas_object.save!
end

def create_random_canvas_object
  send([:create_rectangle, :create_text, :create_line, :create_ellipse].sample)
end

Role.create(id: 1, name: :Owner, can_edit: true, can_change_roles: true, can_assign_admin: true, can_ignore_rules: true)

Role.create(id: 2, name: :Admin, can_edit: true, can_ignore_rules: true)
Role.create(id: 3, name: :Admin, can_edit: true, can_ignore_rules: true, can_change_roles: true)
Role.create(id: 4, name: :Admin, can_edit: true, can_ignore_rules: true, can_change_roles: true, can_assign_admin: true)

Role.create(id: 5, name: :Editor, can_edit: true)

Role.create(id: 6, name: :Viewer)

Role.create(id: 7, name: :Invited)

password = 'qweqwe'
names = (0..9).to_a
emails = names.map { |name| "example#{name}@example" }
i = 0
while i < emails.length do
  user = User.new
  user.name = "example#{names[i]}"
  user.email = emails[i]
  user.password = password
  user.password_confirmation = password
  user.save!
  i += 1
end

10.times {create_user(password)}

20.times {create_owner}

100.times {create_member}

250.times {create_random_canvas_object}

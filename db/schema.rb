# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_03_22_222542) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "boards", force: :cascade do |t|
    t.string "name"
    t.string "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "canvas_objects", force: :cascade do |t|
    t.bigint "board_id", null: false
    t.integer "index"
    t.boolean "locked"
    t.string "stroke"
    t.integer "strokeWidth"
    t.float "opacity"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["board_id"], name: "index_canvas_objects_on_board_id"
    t.index ["index", "board_id"], name: "index_canvas_objects_on_index_and_board_id", unique: true
  end

  create_table "ellipses", force: :cascade do |t|
    t.bigint "canvas_object_id", null: false
    t.integer "x"
    t.integer "y"
    t.string "fill"
    t.integer "radiusX"
    t.integer "radiusY"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["canvas_object_id"], name: "index_ellipses_on_canvas_object_id", unique: true
  end

  create_table "lines", force: :cascade do |t|
    t.bigint "canvas_object_id", null: false
    t.integer "points", array: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["canvas_object_id"], name: "index_lines_on_canvas_object_id", unique: true
  end

  create_table "members", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "board_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "role_id", null: false
    t.index ["board_id"], name: "index_members_on_board_id"
    t.index ["role_id"], name: "index_members_on_role_id"
    t.index ["user_id", "board_id"], name: "index_members_on_user_id_and_board_id", unique: true
    t.index ["user_id"], name: "index_members_on_user_id"
  end

  create_table "rectangles", force: :cascade do |t|
    t.bigint "canvas_object_id", null: false
    t.integer "x"
    t.integer "y"
    t.integer "width"
    t.integer "height"
    t.string "fill"
    t.integer "cornerRadius"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["canvas_object_id"], name: "index_rectangles_on_canvas_object_id", unique: true
  end

  create_table "roles", force: :cascade do |t|
    t.integer "name"
    t.boolean "can_edit"
    t.boolean "can_change_roles"
    t.boolean "can_assign_admin"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "can_ignore_rules"
  end

  create_table "texts", force: :cascade do |t|
    t.bigint "canvas_object_id", null: false
    t.integer "x"
    t.integer "y"
    t.string "fill"
    t.string "text"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["canvas_object_id"], name: "index_texts_on_canvas_object_id", unique: true
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "name"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["name", "email"], name: "index_users_on_name_and_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "canvas_objects", "boards"
  add_foreign_key "ellipses", "canvas_objects"
  add_foreign_key "lines", "canvas_objects"
  add_foreign_key "members", "boards"
  add_foreign_key "members", "roles"
  add_foreign_key "members", "users"
  add_foreign_key "rectangles", "canvas_objects"
  add_foreign_key "texts", "canvas_objects"
end

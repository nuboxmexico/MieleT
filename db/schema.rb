# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2022_12_23_131758) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"
  enable_extension "unaccent"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.bigint "byte_size", null: false
    t.string "checksum", null: false
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "activities", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "countries", force: :cascade do |t|
    t.string "name"
    t.string "iso"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "data_downloads", force: :cascade do |t|
    t.string "data_type"
    t.bigint "user_id", null: false
    t.string "errors_body"
    t.boolean "finished"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "file_resource_id"
    t.string "description"
    t.index ["file_resource_id"], name: "index_data_downloads_on_file_resource_id"
    t.index ["user_id"], name: "index_data_downloads_on_user_id"
  end

  create_table "file_resources", force: :cascade do |t|
    t.string "name"
    t.string "object_source"
    t.string "mime"
    t.string "description"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "notifications", force: :cascade do |t|
    t.string "recipient_type", null: false
    t.bigint "recipient_id", null: false
    t.string "type", null: false
    t.jsonb "params"
    t.datetime "read_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["read_at"], name: "index_notifications_on_read_at"
    t.index ["recipient_type", "recipient_id"], name: "index_notifications_on_recipient_type_and_recipient_id"
  end

  create_table "payment_methods", force: :cascade do |t|
    t.string "name"
    t.string "provider"
    t.string "logo"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "country_id"
    t.index ["country_id"], name: "index_payment_methods_on_country_id"
  end

  create_table "payments", force: :cascade do |t|
    t.bigint "user_id"
    t.string "customer_id"
    t.string "object_id"
    t.string "object_class"
    t.float "amount"
    t.string "status", default: "pending"
    t.string "token_ws"
    t.text "provider_params"
    t.string "transaction_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "number"
    t.bigint "payment_method_id"
    t.index ["payment_method_id"], name: "index_payments_on_payment_method_id"
    t.index ["user_id"], name: "index_payments_on_user_id"
  end

  create_table "roles", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "technician_activities", force: :cascade do |t|
    t.bigint "technician_id", null: false
    t.bigint "activity_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["activity_id"], name: "index_technician_activities_on_activity_id"
    t.index ["technician_id"], name: "index_technician_activities_on_technician_id"
  end

  create_table "technician_taxons", force: :cascade do |t|
    t.bigint "technician_id", null: false
    t.integer "taxon_id"
    t.string "taxon_type"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "taxon_name"
    t.index ["technician_id"], name: "index_technician_taxons_on_technician_id"
  end

  create_table "technician_zipcodes", force: :cascade do |t|
    t.bigint "technician_id", null: false
    t.bigint "zipcode_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["technician_id"], name: "index_technician_zipcodes_on_technician_id"
    t.index ["zipcode_id"], name: "index_technician_zipcodes_on_zipcode_id"
  end

  create_table "technicians", force: :cascade do |t|
    t.string "n_store"
    t.bigint "user_id", null: false
    t.string "vehicle_info"
    t.string "vehicle_license"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "photo"
    t.integer "jobs_count", default: 0
    t.string "enterprise"
    t.index ["user_id"], name: "index_technicians_on_user_id"
  end

  create_table "user_countries", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "country_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["country_id"], name: "index_user_countries_on_country_id"
    t.index ["user_id"], name: "index_user_countries_on_user_id"
  end

  create_table "user_roles", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "role_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["role_id"], name: "index_user_roles_on_role_id"
    t.index ["user_id"], name: "index_user_roles_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "firstname"
    t.string "lastname"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.string "surname"
    t.string "cellphone"
    t.string "phone"
    t.string "cost_center"
    t.string "role_id"
    t.string "worktime"
    t.string "api_key"
    t.string "customer_id"
    t.string "from_auth", default: ""
    t.boolean "disabled", default: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  create_table "zipcodes", force: :cascade do |t|
    t.string "zip"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "administrative_demarcation_name"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "data_downloads", "file_resources"
  add_foreign_key "data_downloads", "users"
  add_foreign_key "payment_methods", "countries"
  add_foreign_key "payments", "payment_methods"
  add_foreign_key "payments", "users"
  add_foreign_key "technician_activities", "activities"
  add_foreign_key "technician_activities", "technicians"
  add_foreign_key "technician_taxons", "technicians"
  add_foreign_key "technician_zipcodes", "technicians"
  add_foreign_key "technician_zipcodes", "zipcodes"
  add_foreign_key "technicians", "users"
  add_foreign_key "user_countries", "countries"
  add_foreign_key "user_countries", "users"
  add_foreign_key "user_roles", "roles"
  add_foreign_key "user_roles", "users"
end

FactoryBot.define do
  factory :technician do
    n_store { "MyString" }
    user factory: :user
    vehicle_info { "MyString" }
    vehicle_license { "MyString" } 
    created_at {Time.now}
    updated_at {Time.now}
  end
end

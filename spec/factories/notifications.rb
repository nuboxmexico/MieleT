FactoryBot.define do
  factory :notification do
    recipient factory: :user
    type { "TEST" }
    params { "" }
    read_at { "2021-06-15 15:29:35" }
  end
end

FactoryBot.define do
  factory :user_country do
    user factory: :user
    country factory: :country
  end
end

FactoryBot.define do
  factory :user_role do
    user factory: :user
    role factory: :role
  end
end

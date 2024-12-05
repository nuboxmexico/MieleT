FactoryBot.define do
  factory :technician_activity do
    technician factory: :technician
    activity factory: :activity
  end
end

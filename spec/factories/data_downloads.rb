FactoryBot.define do
  factory :data_download do
    data_type { "MyString" }
    user { nil }
    errors_body { "MyString" }
    finished { false }
  end
end

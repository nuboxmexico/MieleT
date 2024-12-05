FactoryBot.define do
  factory :file_resource do
    name { "MyString" }
    object_source { "MyString" }
    mime { "MyString" }
    description { "MyString" }
    resource { nil }
  end
end

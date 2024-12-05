FactoryBot.define do
  factory :role do
    name { "Administrador" }
    factory :role_contact do
      name { "Contact Center" }
    end
    factory :role_tech do
      name { "Técnico" }
    end
    
    factory :field_service do
      name { "Field Service" }
    end
  end
end

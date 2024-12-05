FactoryBot.define do
  factory :country do
    name { "México" }
    iso { "MX" }
    factory :country_cl do
      name { "Chile" }
      iso { "CL" }
    end
  end
end

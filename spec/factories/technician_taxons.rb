FactoryBot.define do
  factory :technician_taxon do
    technician factory: :technician
    taxon_id { 5252 }
    taxon_type { "installation" }
  end
end

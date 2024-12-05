require 'rails_helper'

RSpec.describe Technician, type: :model do
  let(:technician){create(:technician)}
  it "check methods" do
    technician.created_at
    technician.updated_at
    technician.save

    search_technician = Technician.search("test").try(:take)
    expect(search_technician).to eq technician

    
    expect(Technician.taxonTypeName('Instalación')).to eq "installation"
    expect(Technician.taxonTypeName('Mantenimiento')).to eq "maintenance"
    expect(Technician.taxonTypeName('Reparación')).to eq "repair"
    expect(Technician.taxonTypeName('Diagnóstico en Taller')).to eq "diagnosis"
    expect(Technician.taxonTypeName('Home Program')).to eq "home_program"
    
    Technician.search_by_taxon_id("", taxon_type = "", "MX", "012000")
    Technician.search_by_taxon_id("", taxon_type = "", "CL", "Puente Alto")
  end
  

  
end


require 'rails_helper'
RSpec.describe Api::V1::TechniciansController, type: :controller do
  describe "GET methods" do
    let(:user){create(:user)}
    let(:service){create(:service)}
    let(:technicians){create(:technicians)}
    
    before :each do
      @request.env["devise.mapping"] = Devise.mappings[:user]
      sign_in user
    end
  
    it "check get_technicians_by_taxon" do
      params = {country: "MX", zone: "012000", taxons_ids: "1,2,3", taxon_type: "Reparación", format: :json}
      get :get_technicians_by_taxon, params: params
      expect(response.status).to eq(200)
    end

    it "check zip codes" do
      technician = build :technician
      technician.user_id = user.id
      technician.save!

      #@file = fixture_file_upload('files/Zipcodes.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      #@file[:original_filename] = "Zipcodes.xlsx",
  
      params = {
        zoneFile: fixture_file_upload(file_fixture('Zipcodes.xlsx')),
        file: nil,
        activities: "",
        id: technician,
        n_store: 'TEST2 updated',
        user_id: technician.user.id,
        vehicle_info: 'TEST2 updated',
        vehicle_license: 'TEST2 updated',
        photo: 'photo_url',
        format: :json
      }
      post :update, params: params
      expect(response.status).to eq(200)
    end
  end
end

require 'rails_helper'
RSpec.describe Api::V1::ServicesController, type: :controller do
  describe "GET methods" do
    let(:user){create(:user)}
    let(:service){create(:service)}
    let(:technicians){create(:technicians)}
    
    before :each do
      @request.env["devise.mapping"] = Devise.mappings[:user]
      sign_in user
      @params = {:id => 1 ,format: :json}
    end
  
    it "check index_by_techinician" do
        params = {technician_id: "1", format: :json}
        get :index_by_techinician, params: params
        expect(response.status).to eq(200)
    end

    it "check selected_spare_parts" do
      params = {id: "1", products: "1", format: :json}
      get :selected_spare_parts, params: params
      expect(response.status).to eq(200)
    end

    it "check create_spare_part" do
        params = {id: "1", products: "1", format: :json}
        get :create_spare_part, params: params
        expect(response.status).to eq(200)
    end

    it "check update_spare_part" do
        params = {id: "1", service_spare_part_id: "1", quantity: "1", format: :json}
        get :update_spare_part, params: params
        expect(response.status).to eq(200)
    end

      
    it "check update_visit" do
        params = {id: "1", visit_id: "1", technicians_ids: "1",  format: :json}
        get :update_visit, params: params
        expect(response.status).to eq(200)
    end

    it "assign_spare_parts" do
      @params[:id] = 1
      @params[:service_spare_part_ids] = 1
      @params[:technician_id] = 1
      post :assign_spare_parts, params: @params
      expect(response.status).to eq(200)

    end


    it "technician_spare_parts" do
      params = {id: "1", technician_id: "1",  format: :json}
      get :technician_spare_parts, params: params
      expect(response.status).to eq(200)
    end

    it "technician_all_spare_parts" do
      params = {technician_id: "1",  format: :json}
      get :technician_all_spare_parts, params: params
      expect(response.status).to eq(200)
    end

    it "technician_all_used_spare_parts" do
      params = {technician_id: "1",  format: :json}
      get :technician_all_used_spare_parts, params: params
      
      expect(response.status).to eq(200)
    end

    it "delete_spare_parts" do

      @params[:id] = 1
      @params[:service_spare_part_id] = 1
      delete :delete_spare_parts, params: @params
      expect(response.status).to eq(400)

   end
   

  end
end
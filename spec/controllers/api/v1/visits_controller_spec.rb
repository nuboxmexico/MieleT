
require 'rails_helper'
RSpec.describe Api::V1::VisitsController, type: :controller do
  describe "GET methods" do
    let(:user){create(:user)}

    before :each do
      @request.env["devise.mapping"] = Devise.mappings[:user]
      sign_in user
    end

    it "check visit" do
      params = {:id=>"1", format: :json}
      get :show, params: params
      expect(response.status).to eq(200)
    end

    it "start visit" do
        params = {:id=>"1", format: :json}
        get :start_visit, params: params
        expect(response.status).to eq(200)
      end
      

    it "finish visit" do
        params = {:id=>"1", format: :json}
        get :finish_visit, params: params
        expect(response.status).to eq(200)
    end

    it "arrival visit" do
      params = {:id=>"1", format: :json}
      get :arrival_visit, params: params
      expect(response.status).to eq(200)
    end

    it "technicians visit" do
      params = {:id=>"1", format: :json}
      get :technicians, params: params
      expect(response.status).to eq(200)
    end

    it "update visit" do
      params = {
          id:"1",
          payment_channel:"TEST",
          payment_date:"20/01/2020",
          customer_payment_date:"20/01/2020",
          payment_files: [],
          format: :json
      }
      patch :update, params: params
      expect(response.status).to eq(200)
    end

    it "assign_spare_parts visit" do
      params = {
          id:"1",
          visit_spare_part_id:"1",
          technician_id:"1",
          quantity:"1",
          format: :json
      }
      post :assign_spare_parts, params: params
      expect(response.status).to eq(200)
    end

    it "received_spare_parts visit" do
      params = {
          id:"1",
          visit_spare_part_ids:"1",
          technician_id:"1",
          quantity:"1",
          format: :json
      }
      post :received_spare_parts, params: params
      expect(response.status).to eq(200)
    end

    it "technician_spare_parts visit" do
      params = {:id=>"1", technician_id: "1", format: :json}
      get :technician_spare_parts, params: params
      expect(response.status).to eq(200)
    end


    it "request_spare_parts visit" do
      params = {
          id:"1",
          products:"1",
          customer_product_id:"1",
          quantities:"1",
          warranties: "No",
          format: :json
      }
      post :request_spare_parts, params: params
      expect(response.status).to eq(200)
    end

    it "requested_spare_parts visit" do
      params = {:id=>"1", format: :json}
      get :requested_spare_parts, params: params
      expect(response.status).to eq(200)
    end
    
    it "technician_all_spare_parts" do
      params = {:id=>"1", technician_id: "1", format: :json}
      get :technician_all_spare_parts, params: params
      expect(response.status).to eq(200)
    end

  end
end
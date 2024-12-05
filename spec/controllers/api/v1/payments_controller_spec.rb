require 'rails_helper'
RSpec.describe Api::V1::PaymentsController, type: :controller do
  describe "GET methods" do
    let(:user){create(:user)}
    let(:service){create(:service)}
    
    before :each do
      @request.env["devise.mapping"] = Devise.mappings[:user]
      sign_in user
    end
  
    it "check save_payment_data" do
        
      payment_method = build :payment_method
      payment_method.save!
      params = {object_id: "1", user_id: "1", customer_id: "1", amount: "10000", object_class: "Servicio", result_indicator: "result_indicator", session_version: "session_version", provider_id: "1", format: :json}
      get :save_payment_data, params: params
      expect(response.status).to eq(200)
      params = {object_id: "1", user_id: "1", customer_id: "1", amount: "10000", object_class: "Servicio", result_indicator: "result_indicator", session_version: "session_version", provider_id: "2", format: :json}
      get :save_payment_data, params: params
      expect(response.status).to eq(400)
    end
  end
end
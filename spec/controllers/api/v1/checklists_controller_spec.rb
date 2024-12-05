
require 'rails_helper'
RSpec.describe Api::V1::ChecklistsController, type: :controller do
  describe "GET methods" do
    let(:user){create(:user)}

    before :each do
      @request.env["devise.mapping"] = Devise.mappings[:user]
      sign_in user
    end

    it "check checklists" do
      params = {:id=>"1", format: :json}
      get :index, params: params
      expect(response.status).to eq(200)
    end

    it "check customer products checklists" do
        params = {:id=>"1", format: :json}
        get :customer_product_checklists, params: params
        expect(response.status).to eq(200)
    end


    it "check customer products checklists" do
      params = {:customer_product_id=>"1", format: :json}
      get :get_answers, params: params
      expect(response.status).to eq(200)
    end

    

    it "answer customer products checklists" do
      params = {customer_product_id: "1", answers: [checklist_id: "1", background: "TEST", answer: "Si"], format: :json}
      post :answers, params: params
      expect(response.status).to eq(200)
    end


  end
end

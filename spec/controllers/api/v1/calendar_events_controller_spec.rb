
require 'rails_helper'
RSpec.describe Api::V1::CalendarEventsController, type: :controller do
  describe "GET methods" do
    let(:user){create(:user)}
    let(:service){create(:service)}
    
    before :each do
      @request.env["devise.mapping"] = Devise.mappings[:user]
      sign_in user
    end
  
    it "check destroy" do
      params = {technician_id: "1", finish_date: "22/03/2020", start_date: "22/02/2020",format: :json}
      delete :destroy, params: params
      expect(response.status).to eq(200)
    end
  end
end
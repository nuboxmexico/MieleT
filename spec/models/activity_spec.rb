require 'rails_helper'

RSpec.describe Activity, type: :model do
  
  let(:field_user){create(:field_user)}
    it "check methods" do
      field_user.created_at
      field_user.updated_at
      field_user.generate_api_key
      field_user.save
      
    end
end

require 'rails_helper'

RSpec.describe User, type: :model do
    let(:user){create(:user)}
    it "check methods" do
      user.created_at
      user.updated_at
      user.generate_api_key
      user.save
    
      search_user = User.search("test").try(:take)
      expect(search_user).to eq user
    end
end



require 'rails_helper'

describe 'Ability', type: :feature do 
	let(:user){create(:user)}
    let(:contact_user){create(:contact_user)}
    let(:tech_user){create(:tech_user)}
    let(:field_user){create(:field_user)}
    
    
    
    context "check habilities" do
		before do 
			login_as(user)
        end
        
        it "check current user abilities" do
            expect(user.can?(:create, User)).should be_truthy
            
            expect(contact_user.can?(:create, User)).should be_truthy
            
            expect(field_user.can?(:create, User)).should be_truthy
             
        end
    end
end
  
require 'rails_helper'

describe 'Calendar API', type: :feature do 
    let(:user){create(:user)}
    context "get data" do
		before do 
			login_as(user)
        end
        
        it "visit calendar administrator block and unblock", js: true do
            country_mx = build :country
            country_mx.save!
            visit main_app.root_path
            find(".mdl-layout__drawer-button").click
            find("#calendar-link").click
            expect(page).to have_current_path("/calendar")
            
        end

        
    end
end
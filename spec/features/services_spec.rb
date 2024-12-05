require 'rails_helper'

describe 'Service', type: :feature do 
	let(:user){create(:user)}
    let(:service){create(:service)}
    
    context "serivces functionalities" do
		before do 
			login_as(user)
        end
 
        it 'enter to serivces index', js: true do
			visit main_app.root_path
			sleep(1)
			find(".mdl-layout__drawer-button").click
		    #find("#services-link").click
            visit "/services"
			expect(page).to have_current_path("/services")
			first(".services-show-link").click
			
		end
	end

end
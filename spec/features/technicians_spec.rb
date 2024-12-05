require 'rails_helper'

describe 'Technician', type: :feature do 
    let(:technician){create(:technician)}
    let(:technician_taxon){create(:technician_taxon)}
	let(:user){create(:user)}
    
    context "technicians functionalities" do
		before do 
			login_as(user)
        end
        

        it 'enter to technicians cruds', js: true do
			visit main_app.root_path
			find(".mdl-layout__drawer-button").click
            find("#technicians-link").click
            expect(page).to have_current_path("/technicians")
        end

        it 'create techinician', js: true do
            visit main_app.root_path
            find("#technicians-link").click
            sleep(1)
            page.execute_script("document.getElementsByClassName('mdl-layout__drawer-button')[0].click();");
            page.execute_script("document.getElementsByClassName('mdl-layout__obfuscator')[0].remove();");
            new_user = build :tech_user
            new_user.email = "test@tech.cl"
            new_user.save!
            visit "/technicians"
            find("#technicians-new").click
            sleep(2)
            page.execute_script("document.getElementsByClassName('MuiAutocomplete-popupIndicator')[0].click();");
            sleep(1)
            page.execute_script("document.getElementById('asynchronous-users-popup').childNodes[0].click();");
            
            page.fill_in 'store', with: 'new store'
            page.fill_in 'vehicleInfo', with: 'new vehicleInfo'
            page.fill_in 'vehicleLicense', with: 'new vehicleLicense'
            find("#techinician-save").click
            sleep(1)
			expect(Technician.last.n_store).to eq "new store"
        end
        
        it 'create and edit techinician', js: true do
            visit main_app.root_path
            new_tech = build :technician
            new_tech.user_id = user.id
            new_tech.save!
            new_activity = build :activity
            new_activity.save!
            new_tech.activities << new_activity
            new_technician_taxon = build :technician_taxon
            new_technician_taxon.technician_id = new_tech.id
            new_technician_taxon.save!
            find("#technicians-link").click
            sleep(1)
            page.execute_script("document.getElementsByClassName('mdl-layout__drawer-button')[0].click();");
			page.execute_script("document.getElementsByClassName('mdl-layout__obfuscator')[0].remove();");
            visit "/technicians"
            sleep(1)
            find(".technicians-edit-link", visible: false).click
            sleep(1)
            page.fill_in 'store', with: 'new store'
            attach_file('newPhoto', File.join(Rails.root, '/spec/support/administrator.jpg'), make_visible: true)
            find("#techinician-save").click
            sleep(1)
            #save_and_open_screenshot
			expect(Technician.find(new_tech.id).n_store).to eq "new store"
        end

        it 'create and delete techinician', js: true do
            visit main_app.root_path
            new_tech = build :technician
            new_tech.user_id = user.id
            new_tech.save!
            new_technician_taxon = build :technician_taxon
            new_technician_taxon.technician_id = new_tech.id
            new_technician_taxon.save!
            find("#technicians-link").click
            sleep(1)
            page.execute_script("document.getElementsByClassName('mdl-layout__drawer-button')[0].click();");
			page.execute_script("document.getElementsByClassName('mdl-layout__obfuscator')[0].remove();");
            visit "/technicians"
            sleep(1)
            find(".delete-technician-link", visible: false).click
            sleep(1)
            find("#delete-tech-btn").click
            sleep(1)
			expect(Technician.last).to eq nil
        end

        
	end

end
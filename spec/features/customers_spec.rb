require 'rails_helper'

describe 'Customer', type: :feature do 
	let(:user){create(:user)}
    let(:customer){create(:customer)}
    
    context "customers functionalities" do
		before do 
			login_as(user)
        end
        

		it 'create customer', js: true do
			visit main_app.root_path
			find(".mdl-layout__drawer-button").click
			find("#customers-link").click
			sleep(1)
			page.execute_script("document.getElementsByClassName('mdl-layout__drawer-button')[0].click();");
			page.execute_script("document.getElementsByClassName('mdl-layout__obfuscator')[0].remove();");
			sleep(2)
			find("#customers-new").click
			sleep(1)
			page.fill_in 'firstname', with: 'test names'
			page.fill_in 'lastname', with: 'test lastname'
			page.fill_in 'surname', with: 'test surname'
			page.fill_in 'email', with: 'test_email@email.cl'
			page.fill_in 'zipcode', with: 'test zipcode'
			page.fill_in 'delegation', with: 'test delegation'
			page.fill_in 'street_name', with: 'test street_name'
			page.fill_in 'ext_number', with: 'test ext_number'
			page.fill_in 'int_number', with: 'test int_number'
			page.fill_in 'phone', with: 'test phone'
			page.fill_in 'cellphone', with: 'test cellphone'
			page.fill_in 'reference', with: 'test reference'
			page.fill_in 'business_name', with: 'test business_name'
			page.fill_in 'rfc', with: 'test rfc'
			page.fill_in 'email_fn', with: 'test_email@email.cl'
			page.fill_in 'zipcode_fn', with: 'test zipcode_fn'
			page.fill_in 'delegation_fn', with: 'test delegation_fn'
			page.fill_in 'street_name_fn', with: 'test street_name_fn'
			page.fill_in 'ext_number_fn', with: 'test ext_number_fn'
			page.fill_in 'int_number_fn', with: 'test int_number_fn'
			page.fill_in 'phone_fn', with: 'test phone_fn'
			
			find("#customer-save").click
			expect(page).to have_current_path("/customers")
		end


        it 'enter to customers crud and edit', js: true do
			visit main_app.root_path
			find(".mdl-layout__drawer-button").click
			find("#customers-link").click
			sleep(1)
			page.execute_script("document.getElementsByClassName('mdl-layout__drawer-button')[0].click();");
			page.execute_script("document.getElementsByClassName('mdl-layout__obfuscator')[0].remove();");
			#save_and_open_screenshot
            first(".customers-edit-link").click
			sleep(2)
            find("#customer-save").click
			
			expect(page).to have_current_path("/customers")
		end

		it 'enter to customers crud, show and add product', js: true do
			visit main_app.root_path
			find(".mdl-layout__drawer-button").click
			find("#customers-link").click
			sleep(1)
			page.execute_script("document.getElementsByClassName('mdl-layout__drawer-button')[0].click();");
			page.execute_script("document.getElementsByClassName('mdl-layout__obfuscator')[0].remove();");
			first(".customers-show-link").click
			sleep(2)
			#save_and_open_screenshot
			page.execute_script("document.getElementsByClassName('product-checkbox')[0].click();");
			find("#add-customer-product").click
			expect(page).to have_current_path("/customers/25/show")
		end
		
		it 'enter to customers crud, show and add product additional', js: true do
			visit main_app.root_path
			find(".mdl-layout__drawer-button").click
			find("#customers-link").click
			sleep(1)
			page.execute_script("document.getElementsByClassName('mdl-layout__drawer-button')[0].click();");
			page.execute_script("document.getElementsByClassName('mdl-layout__obfuscator')[0].remove();");
			first(".customers-show-link").click
			sleep(1)
			find("#additional-product-id").click
			page.fill_in 'business_unit', with: 'test business_unit'
			page.fill_in 'family', with: 'test family'
			page.fill_in 'subfamily', with: 'test subfamily'
			page.fill_in 'product_name', with: 'test product_name'
			find("#product-additional-save").click
			expect(page).to have_current_path("/customers/25/show")
		end
		

		it 'enter to customers crud and show and new service then edit', js: true do
			visit main_app.root_path
			find(".mdl-layout__drawer-button").click
			find("#customers-link").click
			sleep(1)
			page.execute_script("document.getElementsByClassName('mdl-layout__drawer-button')[0].click();");
			page.execute_script("document.getElementsByClassName('mdl-layout__obfuscator')[0].remove();");
			#save_and_open_screenshot
			first(".customers-show-link").click
			sleep(1)
			first(".new-service-link").click
			sleep(1)
			expect(page).to have_current_path("/customers/34/new_service")
			#page.execute_script("document.getElementsByClassName('MuiCheckbox-root')[0].click();");
			find("#service-save").click
			find("#payment-email-send").click
			expect(page).to have_current_path("/customers/34/show")
			sleep(1)
			first(".services-show-link").click
			expect(page).to have_current_path("/customers/25/services/34/edit_service")
		end

		it 'enter to customers crud and show  and new policy', js: true do
			visit main_app.root_path
			find(".mdl-layout__drawer-button").click
			find("#customers-link").click
			sleep(1)
			page.execute_script("document.getElementsByClassName('mdl-layout__drawer-button')[0].click();");
			page.execute_script("document.getElementsByClassName('mdl-layout__obfuscator')[0].remove();");
			#save_and_open_screenshot
			first(".customers-show-link").click
			sleep(1)
			first(".new-policy-link").click
			sleep(1)
			expect(page).to have_current_path("/customers/34/new_policy")
			page.execute_script("document.getElementsByClassName('MuiCheckbox-root')[0].click();");
			find("#policy-save").click
			expect(page).to have_current_path("/customers/34/new_policy")
		end

		it 'enter to customers crud and show and edit policy', js: true do
			visit main_app.root_path
			find(".mdl-layout__drawer-button").click
			find("#customers-link").click
			sleep(1)
			page.execute_script("document.getElementsByClassName('mdl-layout__drawer-button')[0].click();");
			page.execute_script("document.getElementsByClassName('mdl-layout__obfuscator')[0].remove();");
			#save_and_open_screenshot
			first(".customers-show-link").click
			sleep(1)
			page.execute_script("document.getElementById('simple-tab-1').click();");
			first(".customers-edit-policy-link").click
			find("#policy-save").click
			expect(page).to have_current_path("/customers/34/policies/8/edit_policy")
		end

		it 'customer show and add additional address, edit it and delete', js: true do
			visit main_app.root_path
			find(".mdl-layout__drawer-button").click
			find("#customers-link").click
			sleep(1)
			page.execute_script("document.getElementsByClassName('mdl-layout__drawer-button')[0].click();");
			page.execute_script("document.getElementsByClassName('mdl-layout__obfuscator')[0].remove();");
            first(".customers-show-link").click
			sleep(1)
			page.execute_script("document.getElementById('panel1a-header-address').click();")
			sleep(1)
			first(".add-additionaladdress-link").click
			sleep(1)
			page.fill_in 'firstname', with: 'test names'
			page.fill_in 'street_name', with: 'test street_name'
			page.fill_in 'ext_number', with: 'test ext_number'
			page.fill_in 'int_number', with: 'test int_number'
			find("#additional-save").click
			sleep(1)
			expect(page).to have_current_path("/customers/34/show")
		end

		it 'customer show and edit additional address', js: true do
			visit main_app.root_path
			find(".mdl-layout__drawer-button").click
			find("#customers-link").click
			sleep(1)
			page.execute_script("document.getElementsByClassName('mdl-layout__drawer-button')[0].click();");
			page.execute_script("document.getElementsByClassName('mdl-layout__obfuscator')[0].remove();");
            first(".customers-show-link").click
			sleep(1)
			page.execute_script("document.getElementById('panel1a-header-address').click();")
			sleep(1)
			first(".additionalsAddress-edit-link").click
			sleep(1)
			find("#additional-save").click
			expect(page).to have_current_path("/customers/34/show")
		end

		it 'customer show and delete additional address', js: true do
			visit main_app.root_path
			find(".mdl-layout__drawer-button").click
			find("#customers-link").click
			sleep(1)
			page.execute_script("document.getElementsByClassName('mdl-layout__drawer-button')[0].click();");
			page.execute_script("document.getElementsByClassName('mdl-layout__obfuscator')[0].remove();");
            first(".customers-show-link").click
			sleep(1)
			page.execute_script("document.getElementById('panel1a-header-address').click();")
			sleep(1)
			first(".additionalsAddress-delete-link").click
			sleep(1)
			find("#delete-additional-address-btn").click
			expect(page).to have_current_path("/customers/25/show")
		end

		it 'customer show and add additional', js: true do
			visit main_app.root_path
			find(".mdl-layout__drawer-button").click
			find("#customers-link").click
			sleep(1)
			page.execute_script("document.getElementsByClassName('mdl-layout__drawer-button')[0].click();");
			page.execute_script("document.getElementsByClassName('mdl-layout__obfuscator')[0].remove();");
            first(".customers-show-link").click
			sleep(1)
			page.execute_script("document.getElementById('paneladditional-header').click();")
			sleep(1)
			first(".add-additional-edit-link").click
			sleep(1)
			page.fill_in 'firstname', with: 'test names'
			page.fill_in 'lastname', with: 'test lastname'
			page.fill_in 'surname', with: 'test surname'
			page.fill_in 'email', with: 'test_email@email.cl'
			page.fill_in 'phone', with: 'test phone'
			page.fill_in 'cellphone', with: 'test cellphone'
			find("#additional-save").click
			sleep(1)
			expect(page).to have_current_path("/customers/34/show")
		end

		it 'customer show and edit additional', js: true do
			visit main_app.root_path
			find(".mdl-layout__drawer-button").click
			find("#customers-link").click
			sleep(1)
			page.execute_script("document.getElementsByClassName('mdl-layout__drawer-button')[0].click();");
			page.execute_script("document.getElementsByClassName('mdl-layout__obfuscator')[0].remove();");
            first(".customers-show-link").click
			sleep(1)
			page.execute_script("document.getElementById('paneladditional-header').click();")
			sleep(1)
			first(".additional-edit-link").click
			sleep(1)
			find("#additional-save").click
			expect(page).to have_current_path("/customers/34/show")
		end

	end

end
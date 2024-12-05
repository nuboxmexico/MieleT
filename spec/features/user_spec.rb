require 'rails_helper'

describe 'User', type: :feature do 
	let(:user){create(:user)}
	let(:contact_user){create(:contact_user)}
	
	context 'login page' do 
		it 'login with correct credentials', js: true do
			visit main_app.login_path
			expect(page).to have_current_path(main_app.login_path)
			fill_in 'user_email', with: user.email
			fill_in 'user_password', with: 'password123'
			page.execute_script %(document.getElementById("new_user").submit())
			expect(page).to have_current_path(home_path)
		end

		it 'try login with incorrect credentials' do
			visit login_path
			expect(page).to have_current_path(login_path)
			fill_in 'user_email', with: user.email
			fill_in 'user_password', with: 'bad password'
			find('input[name="commit"]').click
			expect(page).to have_current_path("/users/sign_in")
		end

		it 'login with contact center and denied users url', js: true do
			visit main_app.login_path
			expect(page).to have_current_path(main_app.login_path)
			fill_in 'user_email', with: contact_user.email
			fill_in 'user_password', with: 'password123'
			page.execute_script %(document.getElementById("new_user").submit())
			expect(page).to have_current_path(home_path)
			visit "/denied"
			expect(page).to have_current_path(home_path)
			#save_and_open_screenshot
		end

		it 'visit an unauthorized url' do 
			visit "/api/v1/taxons?keywords=tickets"
		end
	end
	
	context "recover password" do
		it 'try to recover pasword with exist user', js: true do
			visit login_path
			expect(page).to have_current_path(login_path)
			find('#recover_password').click
			expect(page).to have_current_path(new_user_password_path)
			fill_in 'user_email', with: user.email
			find('input[name="commit"]').click
			user.send_reset_password_instructions
			expect(page).to have_current_path("/users/sign_in")
			visit ("/users/password/edit?reset_password_token=#{user.reset_password_token}")
			sleep(1)
			fill_in 'user_password', with: "new password"
			fill_in 'user_password_confirmation', with: "new password"
			find('input[name="commit"]').click
			sleep(1)
			expect(page).to have_current_path("/users/password")
		end

		it 'try to recover pasword with non register user' do
			visit login_path
			expect(page).to have_current_path(login_path)
			find('#recover_password').click
			expect(page).to have_current_path(new_user_password_path)
			user.email = "fail@email.com"
			fill_in 'user_email', with: user.email
			find('input[name="commit"]').click
			expect(page).to have_current_path("/users/password")
		end

		it 'try to edit pasword with exist user', js: true do
			@token = user.send_reset_password_instructions
			visit login_path
			expect(page).to have_current_path(login_path)
			#visit ("/users/password/edit?reset_password_token=#{user.reset_password_token}")
			visit edit_user_password_path(reset_password_token: @token)
			sleep(1)
			fill_in 'user_password', with: "new password"
			fill_in 'user_password_confirmation', with: "new password"
			find('input[name="commit"]').click
			sleep(1)
			expect(page).to have_current_path("/home")
		end

		it 'try to edit pasword with exist user but fill password', js: true do
			@token = user.send_reset_password_instructions
			visit login_path
			expect(page).to have_current_path(login_path)
			#visit ("/users/password/edit?reset_password_token=#{user.reset_password_token}")
			visit edit_user_password_path(reset_password_token: @token)
			sleep(1)
			fill_in 'user_password', with: "new password"
			fill_in 'user_password_confirmation', with: "new fail password"
			find('input[name="commit"]').click
			sleep(1)
			expect(page).to have_current_path("/users/password")
		end
	end


	context "user functionalities" do
		before do 
			login_as(user)
		end
		
		it 'enter an sign out', js: true do
			visit main_app.root_path
			find(".mdl-layout__drawer-button").click
			find(".sign-out-link").click
			expect(page).to have_current_path("/login")
		end

		it 'enter to users cruds', js: true do
			visit main_app.root_path
			find(".mdl-layout__drawer-button").click
			find("#users-link").click
			expect(page).to have_current_path("/users")
		end

		it 'enter to users and create a new one', js: true do
			visit main_app.root_path
			find(".mdl-layout__drawer-button").click
			find("#users-link").click
			find("#users-new").click

			page.fill_in 'firstname', with: 'test firstname'
			page.fill_in 'lastname', with: 'test lastname'
			page.fill_in 'email', with: 'test@email.cl'
			page.fill_in 'surname', with: 'test surname'
			page.fill_in 'cellphone', with: '1232123211'
			page.fill_in 'phone', with: '1232123211'
			
			page.execute_script("document.getElementsByClassName('MuiAutocomplete-popupIndicator')[0].click();");
			sleep(1)
            page.execute_script("document.getElementById('center-cost-select-popup').childNodes[0].click();");
			
			
			page.execute_script("document.getElementsByClassName('MuiAutocomplete-popupIndicator')[1].click();");
            sleep(1)
			page.execute_script("document.getElementById('roleId-select-popup').childNodes[0].click();");
			
			find("#user-save").click

			sleep(1)
			expect(User.last.firstname).to eq "test firstname"
			
		end
		
		it 'enter to users and create a new one withou attr', js: true do
			visit main_app.root_path
			find(".mdl-layout__drawer-button").click
			find("#users-link").click
			find("#users-new").click

			find("#user-save").click

			sleep(1)
			expect(User.last.firstname).to eq "test"
			
		end

		it 'enter to users and update one', js: true do
			visit main_app.root_path
			find(".mdl-layout__drawer-button").click
			find("#users-link").click
			first(".users-edit-link").click

			page.fill_in 'firstname', with: 'new test firstname'
			
			find("#user-save").click

			sleep(1)
			expect(User.last.firstname).to eq "new test firstname"
			
		end

		it 'enter to users and update with short password', js: true do
			visit main_app.root_path
			find(".mdl-layout__drawer-button").click
			find("#users-link").click
			first(".users-edit-link").click
			
			page.fill_in 'password', with: '1'
			sleep(1)
			#save_and_open_screenshot
			find("#user-save").click

			sleep(1)
			expect(User.last.firstname).to eq "test"
		end

		it 'enter to users and delete one', js: true do
			visit main_app.root_path
			find(".mdl-layout__drawer-button").click
			find("#users-link").click
			first(".user-delete-link").click
			sleep(1)
			find("#user-delete").click
			sleep(1)
			expect(User.last).to eq nil
			
			#save_and_open_screenshot
		end
		
		

	end
end
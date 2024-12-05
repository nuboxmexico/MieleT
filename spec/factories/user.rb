FactoryBot.define do
  	factory :user do
		email { "oferusat@gmail.com" }
		firstname { "test"}
		lastname { "test"}
		surname { "test"}
	    phone { "test"}
	    role_id { "test"}
	    password { 'password123' }
		password_confirmation { password }
		roles { [association(:role)] }
		countries { [association(:country)] }

		factory :contact_user do
			email { "contact@gmail.com" }
			roles { [association(:role_contact)] }
		end

		factory :tech_user do
			email { "contact@gmail.com" }
			roles { [association(:role_tech)] }
		end

		factory :field_user do
			email { "field_user@gmail.com" }
			roles { [association(:field_service)] }
		end
		
	end

end
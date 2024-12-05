class HomeController < ApplicationController
	load_and_authorize_resource
	
	def index
		if  current_user.technician? 
			sign_out(current_user)
			redirect_to root_path, alert: "No tienes permisos para realizar esta acción"
		end
	end

	def denied
	end
end

class Api::V1::AbilitiesController < ApplicationController
  protect_from_forgery with: :null_session, only: [:check]
  skip_before_action :authenticate_user!, only: [:check]
  include ActionController::HttpAuthentication::Token::ControllerMethods
  before_action :authenticate, only: [:check]

  api :GET, '/v1/abilities/check', 'Verifica los permisos de un usuario'
  param :location, String, desc: 'Url que el usuario pretende verificar'
  param :id, String, desc: 'ID del usuario que pretende verificar'
  example 'Request: ' + Rails.application.config.site_url + "/api/v1/abilities/check?location=/customers/index\n
	Salida:
	{
		controller: 'customers',
		action: 'index',
		user: {
			id: 1,
			firstname: 'Admin',
			lastname: 'Admin',
			created_at: '18/08/2020 16:10:48',
			updated_at: '16/11/2020 15:36:25',
			email: 'admin@admin.com',
			surname: 'Admin',
			cellphone: '',
			phone: '',
			cost_center: '',
			role_id: '',
			worktime: 'Full-Time',
			photo: '',
			country: 'MX'
		},
		check: 'can? index, Customer',
		response: true
	}
	"
  def check
    response = {}
    location_path = params[:location].split('/')
    location_path[1] = 'services' if location_path[1] == 'finance'

    api_controller = (location_path[1].blank? ? 'Home' : location_path[1])
    api_action = (location_path[2].blank? ? 'index' : location_path[2])
    response['controller'] = api_controller
    response['action'] = api_action
    response['user'] = current_user
    model_name = ActiveSupport::Inflector.singularize(api_controller.try(:capitalize)).try(:constantize) rescue ActiveSupport::Inflector.singularize(api_controller.try(:camelize)).try(:constantize)
    response['check'] =
      "can? #{api_action.try(:to_sym)}, #{model_name}"
    response['response'] =
      (can? api_action.try(:to_sym),
            model_name)
    render json: response.to_json
  end
end

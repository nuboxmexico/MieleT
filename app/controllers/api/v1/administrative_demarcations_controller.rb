class Api::V1::AdministrativeDemarcationsController < ApplicationController
	protect_from_forgery with: :null_session, only: [:index]
    skip_before_action :authenticate_user!, only: [:index]
    include ActionController::HttpAuthentication::Token::ControllerMethods
	before_action :authenticate, only: [:index]
	
	api :GET, "/v1/administrative_demarcations", "Retorna la estructura territorial de un país (estados, municipios, regiones)"
	param :keywords, String, :desc => "ISO del pais consultado"
	param :zipcode, String, :desc => "Codigo postal de la dirección (Solo clientes mexicanos)"
	example "Request: "+Rails.application.config.site_url+"/api/v1/administrative_demarcations?keywords=CL\n
	Salida:
	{
		data: [
			{
				id: 1,
				admin_name_1: 'Región de Valparaíso',
				admin_code_1: '01',
				admin_name_2: 'Provincia de Valparaíso',
				admin_code_2: '51',
				admin_name_3: 'Casablanca',
				admin_code_3: '05102',
				place_name: 'Casablanca',
				zipcode: '2480000',
				country_id: 2,
				created_at: '2020-09-16T23:05:37.539Z',
				updated_at: '2020-09-16T23:05:37.539Z',
				country: {
					id: 2,
					name: 'Chile',
					iso: 'CL',
					created_at: '2020-09-02T20:07:18.167Z',
					updated_at: '2020-09-02T20:07:18.167Z'
				},
				admin3_admin1: 'Casablanca, Región de Valparaíso',
				admin3_admin2_admin1: 'Casablanca, Provincia de Valparaíso, Región de Valparaíso',
				country_code: 'CL',
				place_name_admin2_admin1: 'Casablanca, Provincia de Valparaíso Región de Valparaíso'
			}
		]
	}
	"
	def index
        response = {}
	    administrative_demarcations = (params[:keywords].blank? ? ApiSingleton.administrative_demarcations_api("MX", params[:zipcode]) : ApiSingleton.administrative_demarcations_api(params[:keywords],params[:zipcode]))
	    render json:  administrative_demarcations.to_json
	end
end
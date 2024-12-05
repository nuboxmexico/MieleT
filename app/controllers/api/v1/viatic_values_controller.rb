class Api::V1::ViaticValuesController < ApplicationController
    protect_from_forgery with: :null_session, only: [:index]
    skip_before_action :authenticate_user!, only: [:index]
    include ActionController::HttpAuthentication::Token::ControllerMethods
    before_action :authenticate, only: [:index]
	
    api :GET, "/v1/viatic_values", "Lista todos precios de viaticos de Miele o filtrados por pais y zona"
    param :country, String, :desc => "Pais de la listas de precios de viaticos"
    param :zone, String, :desc => "Zona correspondiente al viático. Estado para mexico, Comuna para Chile."
    example "Request: "+Rails.application.config.site_url+"/api/v1/viatic_values?country=CL&zone=Santiago\n
	Salida:
    {
        data: [
            {
                id: 1,
                administrative_demarcation_name: 'Santiago',
                amount: 40000,
                created_at: '2020-10-20T18:11:38.568Z',
                updated_at: '2020-11-16T22:48:44.935Z',
                country_id: 22,
                zipcode: '',
                home_program_value: 5002,
                country: {
                    id: 22,
                    name: 'Chile',
                    iso: 'CL',
                    created_at: '2020-09-02T20:07:18.167Z',
                    updated_at: '2020-09-02T20:07:18.167Z'
                }
                },
            {
                id: 2,
                administrative_demarcation_name: 'Santiago',
                amount: 22000,
                created_at: '2020-11-19T23:38:01.394Z',
                updated_at: '2020-11-19T23:38:01.394Z',
                country_id: 22,
                zipcode: '',
                home_program_value: 3300,
                country: {
                    id: 22,
                    name: 'Chile',
                    iso: 'CL',
                    created_at: '2020-09-02T20:07:18.167Z',
                    updated_at: '2020-09-02T20:07:18.167Z'
                }
            }
        ]   
    }
	"  
    def index
	    response = {}
	    viatic_values = ApiSingleton.viatic_values_api(params[:country], params[:zone])
	    render json:  viatic_values.to_json
	end
end
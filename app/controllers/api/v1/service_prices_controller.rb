class Api::V1::ServicePricesController < ApplicationController
    protect_from_forgery with: :null_session, only: [:index]
    skip_before_action :authenticate_user!, only: [:index]
    include ActionController::HttpAuthentication::Token::ControllerMethods
    before_action :authenticate, only: [:index]
	
    api :GET, "/v1/service_prices", "Lista todos precios de servicios de Miele"
    param :country, String, :desc => "Pais de la listas de precios de servicios" 
    param :products_ids, String, :desc => "ID de los taxones de productos seleccionados, seperados por ,"
    param :service_type, String, :desc => "Tipo de servicio asociado"
    example "Request: "+Rails.application.config.site_url+"/api/v1/service_prices?country=CL&products_ids=1,2&service_type=Instalación\n
    Salida:
    {
        data: {
            2: [
                {
                    id: 2,
                    country_id: 1,
                    technician_quantity: 1,
                    hours: 2,
                    fee_amount: 10000,
                    technician_hours: 2,
                    hour_amount: 1000,
                    total_amount: 11000,
                    created_at: '2020-11-13T20:08:37.513Z',
                    updated_at: '2020-11-19T14:34:10.455Z',
                    service_type: 'Instalación',
                    taxons: [{...}]
                },
                {...},
                {...},
                {...}
            ]
        }
    }
	"
    def index
	    service_prices = ApiSingleton.service_prices_api(params[:country], params[:products_ids], params[:service_type])
	    render json:  service_prices.to_json
	end
end 
class Api::V1::LaborPricesController < ApplicationController
    protect_from_forgery with: :null_session, only: [:index]
    skip_before_action :authenticate_user!, only: [:index]
    include ActionController::HttpAuthentication::Token::ControllerMethods
    before_action :authenticate, only: [:index]
	
    api :GET, "/v1/labor_prices", "Lista todos precios de mano de obra de Miele"
    param :country, String, :desc => "Pais de la listas de precios de mano de obra"
    param :units, String, :desc => "Cantidad de unidades de productos, a consultar por su mano de obra"
    example "Request: "+Rails.application.config.site_url+"/api/v1/labor_prices?country=CL\n
	Salida:
    {
        data: [
            {
                id: 1,
                country_id: 5,
                units: 1,
                amount: 20000,
                created_at: '2020-10-19T14:03:27.868Z',
                updated_at: '2020-10-19T14:03:27.868Z',
                country: {
                    id: 5,
                    name: 'Chile',
                    iso: 'CL',
                    created_at: '2020-09-02T20:07:18.167Z',
                    updated_at: '2020-09-02T20:07:18.167Z'
                    }
            },
            {...},
        ]
    }
	"    
    def index
	    response = {}
	    labor_prices = ApiSingleton.labor_prices_api(params[:country], params[:units])
	    render json:  labor_prices.to_json
	end
end
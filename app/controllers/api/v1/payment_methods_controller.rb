class Api::V1::PaymentMethodsController < ApplicationController
    protect_from_forgery with: :null_session, only: [:index]
    skip_before_action :authenticate_user!, only: [:index]
    include ActionController::HttpAuthentication::Token::ControllerMethods
    before_action :authenticate, except: [:index]
	
    api :GET, "/v1/payment_methods", "Lista todos métodos pagos asociados a un país"
    param :country, String, :desc => "ISO del pais del método de pago."
    example "Request: "+Rails.application.config.site_url+"/api/v1/payment_methods?country=MX\n
	Salida:
    {
        data: [
            {
                id: 1,
                name: 'American Express',
                provider: 'test1',
                logo: 'test1',
                created_at: '2020-10-30T09:26:43.017-06:00',
                updated_at: '2020-10-30T09:26:43.017-06:00',
                country_id: 5,
                logo_url: 'logo_url'
            },
            {
                id: 2,
                name: 'EVO Payments',
                provider: 'test2',
                logo: 'test2',
                created_at: '2020-10-30T09:26:43.029-06:00',
                updated_at: '2020-10-30T09:26:43.029-06:00',
                country_id: 5,
                logo_url: 'logo_url'
            }
            ]
    }
    "
    def index
	    response = {}
	    payments = PaymentMethod.search(params[:country])
        response["data"] = payments
        render json:  response.to_json
	end

end
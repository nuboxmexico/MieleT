class Api::V1::ProductsController < ApplicationController
	protect_from_forgery with: :null_session, only: [:index, :index_by_tnr]
    skip_before_action :authenticate_user!, only: [:index, :index_by_tnr]
    include ActionController::HttpAuthentication::Token::ControllerMethods
	before_action :authenticate, only: [:index, :index_by_tnr]
	
	api :GET, "/v1/products", "Retorna los productos del core filtrados por la plataforma 'Tickets' y paginados"
    param :page, String, :desc => "Pagina consultada 1..n"
    param :per_page, String, :desc => "Resultados por paǵina esperados"
    param :keywords, String, :desc => "Filtro de texto para encontrar al producto"
    param :spare_parts, String, :desc => "Enviar true si se desea solo buscar en las refacciones"
    param :countries, String, :desc => "Codigo ISO del pais. Enviar CL Chile, MX para Mexico, MC,CL para ambos y no enviar parametro para TODOS."
    example "Request: "+Rails.application.config.site_url+"/api/v1/products?page=2&keywords=Aspiradora&spare_parts=true\n
    Salida:
    {
        page: 1,
        per_page: 10,
        data: [
            {
                id: 1,
                country_id: 1,
                platform: 'Tickets',
                tnr: '123456789',
                ean: '987654321',
                profit_center: '123',
                name: 'Aspiradora test',
                description: 'Aspirador test',
                mandatory: true,
                product_type: 'TEST',
                created_at: '2020-11-12T21:36:30.300Z',
                updated_at: '2020-11-12T21:36:30.300Z',
                additional: false,
                home_program_hours: 2,
                taxons: [{...}],
                product_prices: [{...}],
                country: {...}
            },
            {...},
            {...}
        ],
        data_type: 'spare_parts',
        total: 3
    }
	"
    def index
        page = (params[:page].blank? ? 1 : params[:page])
        per_page = (params[:per_page].blank? ? 5 : params[:per_page])
        keywords = (params[:keywords].blank? ? "" : params[:keywords])
        spare_parts = (params[:spare_parts].blank? ? nil : params[:spare_parts])
        countries = (params[:countries].blank? ? nil : params[:countries])
        
        render json:  ApiSingleton.get_products_api(page, per_page, keywords, spare_parts, countries)
	end


    api :GET, "/v1/products_by_tnr", "Retorna los productos del core mediante sus tnrs"
    param :tnrs, String, :desc => "tnrs de los productos separados por ,. Ejemplo: 'tnr1,tnr2,tnr3'"
	param :countries, String, :desc => "Codigo ISO del pais. Enviar CL Chile, MX para Mexico, MC,CL para ambos y no enviar parametro para TODOS."
    example "Request: "+Rails.application.config.site_url+"/api/v1/products_by_tnr?tnrs=tnr1,tnr2,tnr3\n
    Salida:
    {
        page: 1,
        per_page: 10,
        data: [
            {
                id: 1,
                country_id: 1,
                platform: 'Tickets',
                tnr: 'tnr1',
                ean: '987654321',
                profit_center: '123',
                name: 'Aspiradora test',
                description: 'Aspirador test',
                mandatory: true,
                product_type: 'TEST',
                created_at: '2020-11-12T21:36:30.300Z',
                updated_at: '2020-11-12T21:36:30.300Z',
                additional: false,
                home_program_hours: 2,
                taxons: [{...}],
                product_prices: [{...}],
                country: {...}
            },
            {...},
            {...}
        ],
        data_type: 'spare_parts',
        total: 3
    }
	"
	def index_by_tnr
	    tnrs = (params[:tnrs].blank? ? nil : params[:tnrs])
        countries = (params[:countries].blank? ? nil : params[:countries])
        
        render json:  ApiSingleton.get_products_by_tnr_api(tnrs, countries)
	end
end
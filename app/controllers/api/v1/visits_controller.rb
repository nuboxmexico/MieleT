class Api::V1::VisitsController < ApplicationController
    protect_from_forgery with: :null_session, only: [:show, :technicians, :update, :start_visit, :assign_spare_parts, :received_spare_parts, :technician_spare_parts, :technician_all_spare_parts, :finish_visit, :arrival_visit, :request_spare_parts, :requested_spare_parts]
    skip_before_action :authenticate_user!, only: [:show, :technicians, :update, :start_visit, :assign_spare_parts, :received_spare_parts, :technician_spare_parts, :technician_all_spare_parts, :finish_visit, :arrival_visit, :request_spare_parts, :requested_spare_parts]
    include ActionController::HttpAuthentication::Token::ControllerMethods
    before_action :authenticate, only: [:show, :technicians, :update, :start_visit, :assign_spare_parts, :received_spare_parts, :technician_spare_parts, :technician_all_spare_parts, :finish_visit, :arrival_visit, :request_spare_parts, :requested_spare_parts]
	
    api :GET, "/v1/visits/:id", "Lista todos precios de viaticos de Miele o filtrados por pais y zona"
    param :id, String, :desc => "ID de la visita a consultar"
    def show
	    visit = ApiSingleton.get_visit_api(visits_params)
	    render json:  visit.to_json
    end
    
	api :GET, "/v1/visits/:id/technicians", "Lista los técnicos de la visita"
    param :id, String, :desc => "ID de la visita a consultar"
    def technicians
	    visit = ApiSingleton.get_visit_api(visits_params)["data"]
		technicians_ids = visit["calendar_events"].collect{|calendar_events| calendar_events["object_id"]} rescue []
		response = {}
		response["data"] =  Technician.where(id: technicians_ids)
	    render json:  response.to_json
    end



	api :PATCH, "/v1/visits/:id", "Actualiza una visita para un cliente en miele"
    param :id, String, :desc => "ID de la visita a actualizar"
	param :payment_channel, String, :desc => "Canal por el cual se realizó el pago de la visita. Si se requiere validar"
	param :payment_date, String, :desc => "Fecha limite de pago"
	param :customer_payment_date, String, :desc => "Fecha efectiva de pago"
	param :payment_files, Array, :desc => "Array de archivos asociados al pago payment_files:[{uri: [path de la imagen], mime: [formato], uri_64: [imagen en base 64], filename: [nombre imagen}]"
    
    def update
	    visit = ApiSingleton.get_update_visit_api(update_visits_params)
		
	    render json:  visit.to_json
    end
    

    api :POST, "/v1/visits/:id/start", "Inicia una visita, para un cliente Miele"
    param :id, String, :desc => "ID de la visita a consultar"
    def start_visit
	    visit = ApiSingleton.get_start_visit_api(visits_params)
	    render json:  visit.to_json
    end

    api :POST, "/v1/visits/:id/finish", "Finaliza una visita, para un cliente Miele"
    param :id, String, :desc => "ID de la visita a consultar"
    def finish_visit
		visit = ApiSingleton.get_visit_api({ id: visits_params[:id]})["data"]
		customer = ApiSingleton.get_customer_api(visit["customer_id"])["data"]
		customer_service = ApiSingleton.service_api({id: visit["service_id"].to_s})
		if(customer_service["service_type"]!= "Entregas/Despachos" && customer_service["first_visit"]["id"] == visit["id"])
			UserNotification.notify_visit_completed(customer_service)
		end
		if customer_service.present? && (customer_service["service_type"] == "Instalación") && include_home_program?(customer_service['customer_products'])
			UserNotification.notify_home_program_required(customer_service)
		end
		emails = customer["email"]
		unless customer["additionals"].empty? || 
			customer["additionals"].each do |additional|
				emails += ",#{additional["email"]}"
			end
		end
		begin
			NotificationMailer.visit_report_email(emails, visit["service_id"].to_s, visit["id"]).deliver_now
      if customer_service.present? && (customer_service["service_type"] === "Entregas/Despachos") && products_need_instalation?(customer_service['customer_products'])
        UserNotification.notify_instalation_required(customer_service)
      end
		rescue 
			puts "No se ha podido enviar el email."
		end
	    visit = ApiSingleton.get_finish_visit_api(visits_params)
		visit["data"]["visit_customer_products"].each do |visit_cp|
			if visit_cp["customer_product"]["quotation_id"]
				detail_quotation_product = MieleB2bApi.update_state_detail_quotation_product({
					state: visit_cp["customer_product"]["status"],
					serial_id: visit_cp["customer_product"]["serial_id"],
					customer_product_id: visit_cp["customer_product"]["id"].to_s
				})
			end
		end

		if(customer_service["service_type"]== "Entregas/Despachos")
			visit_report_url = "/services/#{customer_service["id"]}/report_pdf?visit_id=#{visit["data"]["id"]}"
			response = MieleB2bApi.close_dispatch_group(visit["data"]["visit_customer_products"][0]["customer_product"]["dispatchgroup_id"], {visit_report_url: visit_report_url})
		end
	    render json:  visit.to_json
    end

    api :POST, "/v1/visits/:id/arrival", "Avisa la llegada al domicilio de una visita, para un cliente Miele"
    param :id, String, :desc => "ID de la visita a consultar"
    def arrival_visit
	    visit = ApiSingleton.get_arrival_visit_api(visits_params)
	    render json:  visit.to_json
    end


    api :POST, "/v1/visits/:id/assign_spare_parts", "Asigna refacciones a un técnico en una visita en Miele Core"
	param :id, String, :desc => "ID de la visita al que pertenece la refacción" 
	param :visit_spare_part_id, String, :desc => "IDs de la refaccion"
	param :technician_id, String, :desc => "ID del tecnico a asignar"
	param :quantity, String, :desc => "Cantidad a asignar"
	example "Request: "+Rails.application.config.site_url+"/api/v1/visits/1/assign_spare_parts\n
	Salida:
    {	[
			id: 1,
			visit_id: 1,
			product_id: 1,
			quantity: 2
			technician_id: 1 
			created_at: '2020-10-29T13:22:43.886Z',
			updated_at: '2020-10-29T13:22:43.886Z',
			product: {
				id: 1,
				country_id: 1,
				platform: 'Tickets',
				tnr: 'test_tnr',
				ean: 'test_ean',
				profit_center: '123',
				name: 'Aspiradora test',
				description: 'Aspirador test desc.',
				mandatory: true,
				product_type: 'TEST',
				created_at: '2020-10-05T22:38:36.457Z',
				updated_at: '2020-11-12T21:36:30.238Z',
				additional: false,
				home_program_hours: 1,
				taxons: [{...}],
				product_prices: [{..}],
				country: {...}
			}
		]
    }
    "
	def assign_spare_parts
		@visit_spare_parts = ApiSingleton.get_assign_visit_spare_parts_api(visits_params)
	    render json:  @visit_spare_parts.to_json
	end

  def invoiced_visits
    visit_ids = params[:visit_ids]
    status = ApiSingleton.invoiced_visits(visit_ids)
    head status
  end

	api :POST, "/v1/visits/:id/received_spare_parts", "Recepciona refacciones a un técnico en una visita en Miele Core"
	param :id, String, :desc => "ID de la visita al que pertenece la refacción" 
	param :visit_spare_part_ids, String, :desc => "IDs de la refaccionnes separados por ,"
	param :technician_id, String, :desc => "ID del tecnico a recepcionar"
	example "Request: "+Rails.application.config.site_url+"/api/v1/visits/1/received_spare_parts\n
	Salida:
    {	[
			id: 1,
			visit_id: 1,
			product_id: 1,
			quantity: 2
			technician_id: 1 
			created_at: '2020-10-29T13:22:43.886Z',
			updated_at: '2020-10-29T13:22:43.886Z',
			product: {
				id: 1,
				country_id: 1,
				platform: 'Tickets',
				tnr: 'test_tnr',
				ean: 'test_ean',
				profit_center: '123',
				name: 'Aspiradora test',
				description: 'Aspirador test desc.',
				mandatory: true,
				product_type: 'TEST',
				created_at: '2020-10-05T22:38:36.457Z',
				updated_at: '2020-11-12T21:36:30.238Z',
				additional: false,
				home_program_hours: 1,
				taxons: [{...}],
				product_prices: [{..}],
				country: {...}
			}
		]
    }
    "
	def received_spare_parts
		requested_visit_spare_parts = ApiSingleton.get_received_visit_spare_parts_api(visits_params)
	    render json:  requested_visit_spare_parts.to_json
    end


	api :GET, "/v1/visits/:id/technician_spare_parts/:technician_id", "Trae las refacciones de un técnico en Miele Core"
	param :id, String, :desc => "ID del servicio al que pertenece la refacción" 
	param :technician_id, String, :desc => "ID del tecnico a asignar"
	example "Request: "+Rails.application.config.site_url+"/api/v1/visits/1/technician_spare_parts/1\n
	Salida:
    {	[
			id: 1,
			service_id: 1,
			product_id: 1,
			quantity: 2
			technician_id: 1 
			created_at: '2020-10-29T13:22:43.886Z',
			updated_at: '2020-10-29T13:22:43.886Z',
			product: {
				id: 1,
				country_id: 1,
				platform: 'Tickets',
				tnr: 'test_tnr',
				ean: 'test_ean',
				profit_center: '123',
				name: 'Aspiradora test',
				description: 'Aspirador test desc.',
				mandatory: true,
				product_type: 'TEST',
				created_at: '2020-10-05T22:38:36.457Z',
				updated_at: '2020-11-12T21:36:30.238Z',
				additional: false,
				home_program_hours: 1,
				taxons: [{...}],
				product_prices: [{..}],
				country: {...}
			}
		]
    }
    "
	def technician_spare_parts
		visit_products = ApiSingleton.get_technician_visit_products_api(visits_params)
	    render json:  visit_products.to_json
	end


	api :GET, "/v1/technician_all_spare_parts/:technician_id", "Trae todas refacciones de un técnico en Miele Core"
	param :technician_id, String, :desc => "ID del tecnico a asignar"
	example "Request: "+Rails.application.config.site_url+"/api/v1/technician_all_spare_parts/1\n
	Salida:
    {	[
			id: 1,
			service_id: 1,
			product_id: 1,
			quantity: 2
			technician_id: 1 
			created_at: '2020-10-29T13:22:43.886Z',
			updated_at: '2020-10-29T13:22:43.886Z',
			product: {
				id: 1,
				country_id: 1,
				platform: 'Tickets',
				tnr: 'test_tnr',
				ean: 'test_ean',
				profit_center: '123',
				name: 'Aspiradora test',
				description: 'Aspirador test desc.',
				mandatory: true,
				product_type: 'TEST',
				created_at: '2020-10-05T22:38:36.457Z',
				updated_at: '2020-11-12T21:36:30.238Z',
				additional: false,
				home_program_hours: 1,
				taxons: [{...}],
				product_prices: [{..}],
				country: {...}
			}
		]
    }
    "
	def technician_all_spare_parts
		visit_products = ApiSingleton.get_technician_visit_all_products_api(visits_params)
	    render json:  visit_products.to_json
	end
	


	api :POST, "/v1/visits/:id/request_spare_parts", "Solicita refacciones en una visita en Miele Core"
	param :id, String, :desc => "ID de la visita al que pertenece la refacción" 
	param :products, String, :desc => "Array de ids de productos de refacción"
	param :customer_product_id, String, :desc => "ID del producto al que se le van a solicitar las refacciones"
	param :quantities, String, :desc => "Cantidades a asignar separadas por ,"
	param :warranties, String, :desc => "Garantiás de las refacciones separadas por ,"
	example "Request: "+Rails.application.config.site_url+"/api/v1/visits/1/request_spare_parts\n
	Salida:
    {
        id: 1,
        service_id: 1,
        product_id: 1,
		visit_id: 1
        created_at: '2020-10-29T13:22:43.886Z',
        updated_at: '2020-10-29T13:22:43.886Z',
		status: 'requested',
		requested_quantity: 1,
        product: {
            id: 1,
            country_id: 1,
            platform: 'Tickets',
            tnr: 'test_tnr',
            ean: 'test_ean',
            profit_center: '123',
            name: 'Aspiradora test',
            description: 'Aspirador test desc.',
            mandatory: true,
            product_type: 'TEST',
            created_at: '2020-10-05T22:38:36.457Z',
            updated_at: '2020-11-12T21:36:30.238Z',
            additional: false,
            home_program_hours: 1,
            taxons: [{...}],
            product_prices: [{..}],
            country: {...}
        }
    }
    "
	def request_spare_parts
		@service_products = ApiSingleton.get_request_spare_parts_visit_api(request_spare_parts_params)
	    render json:  @service_products.to_json
	end

	api :GET, "/v1/visits/:id/requested_spare_parts", "Trae las refacciones asociadas de una visita"
	param :id, String, :desc => "ID del de visita"
    example "Request: "+Rails.application.config.site_url+"/api/v1/visits/1/requested_spare_parts\n
	Salida:
    [
        {
            id: 1,
            service_id: 1,
            product_id: 1,
			visit_id: 1,
            created_at: '2020-10-29T13:22:43.886Z',
            updated_at: '2020-10-29T13:22:43.886Z',
            spare_part: {
                id: 1,
                country_id: 1,
                platform: 'Tickets',
                tnr: 'test_tnr',
                ean: 'test_ean',
                profit_center: '123',
                name: 'Aspiradora test',
                description: 'Aspirador test desc.',
                mandatory: true,
                product_type: 'TEST',
                created_at: '2020-10-05T22:38:36.457Z',
                updated_at: '2020-11-12T21:36:30.238Z',
                additional: false,
                home_program_hours: 1,
                taxons: [{...}],
                product_prices: [{..}],
                country: {...}
            }
        },
        {...}
    ]
    "
	def requested_spare_parts

		requested_visit_spare_parts = ApiSingleton.get_requested_visit_spare_parts_api(request_spare_parts_params)
		
		render json: requested_visit_spare_parts.to_json
	end


    private

	def products_need_instalation?(customer_products)
		return false unless customer_products.present?
		return false unless customer_products.count.positive?
	
		customer_products.each do |customer_product|
      		next unless customer_product['instalation'].present?

			return true if customer_product['instalation'] == true
		end
		false
	end

	def include_home_program?(customer_products)
    	return false unless customer_products.present?
		return false unless customer_products.count.positive?
	
		customer_products.each do |customer_product|
      		next unless customer_product.present?

			return true if customer_product['home_program'] == true
		end
		false
	end

	def visits_params
		params.permit(:id, :visit_spare_part_id, :visit_spare_part_ids, :technician_id, :quantity )
	end

	def request_spare_parts_params
		params.permit(:id, :products, :quantities, :warranties, :customer_product_id )
	end


	def update_visits_params
		params.permit(:id, :assigned_quotation_id, :new_amounts, :payment_channel,:payment_date,:customer_payment_date, payment_files: [] )
	end

end

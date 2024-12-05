class Api::V1::ServicesController < ApplicationController
  protect_from_forgery with: :null_session,
                       only: %i[index filter_options index_by_techinician show status_changes status_label total_price create_spare_part
                                assign_spare_parts update_spare_part spare_parts requested_spare_parts selected_spare_parts technician_spare_parts technician_all_spare_parts technician_all_used_spare_parts delete_spare_parts create_visit update_visit cancel_visit]
  skip_before_action :authenticate_user!,
                     only: %i[index filter_options index_by_techinician show status_changes status_label total_price create_spare_part
                              assign_spare_parts update_spare_part spare_parts requested_spare_parts selected_spare_parts technician_spare_parts technician_all_spare_parts technician_all_used_spare_parts delete_spare_parts create_visit update_visit cancel_visit]
  include ActionController::HttpAuthentication::Token::ControllerMethods
  include Sidekiq::Worker

  before_action :authenticate,
                only: %i[index filter_options index_by_techinician status_changes status_label total_price create_spare_part
                         assign_spare_parts update_spare_part spare_parts requested_spare_parts selected_spare_parts technician_spare_parts technician_all_spare_parts technician_all_used_spare_parts delete_spare_parts create_visit update_visit cancel_visit]
  after_action :send_payment_email, only: [:create_visit]
  api :GET, '/v1/services', 'Lista todos los servicios de un cliente en Miele'
  param :page, String, desc: 'Pagina consultada 1..n'
  param :per_page, String, desc: 'Resultados por paǵina esperados'
  param :customer_id, String, desc: 'customer_id del cliente'
  param :country, String, desc: 'Códigos de paises separados por , si es mas de uno (MX,CL)'
  example 'Request: ' + Rails.application.config.site_url + "/api/v1/services?customer_id=48\n
	Salida:
	{
		page: 1,
		per_page: 10,
		data: [
			{
			id: 34,
			customer_id: 48,
			address: 'principal',
			service_type: 'Instalación',
			subcategory: 'Profesional',
			requested: 'Distribuidor autorizado',
			request_channel: '',
			distributor_name: 'TEST DELI',
			distributor_email: 'test@deli.cl',
			created_at: '09/11/2020 19:08:56',
			updated_at: '09/11/2020 19:08:56',
			technicians_number: 0,
			hour_amount: 0,
			fee_amount: 0,
			total_hours: 0,
			total_amount: 0,
			status: 'new',
			background: '',
			no_payment: false,
			payment_channel: 'phone',
			payment_date: null,
			no_payment_reason: '',
			invoice: false,
			payment_state: 'pending',
			job_id: '40cb228987243c91b2dd0b7c9c4a0856',
			number: 'MTMX000034',
			customer_products: [ ],
			calendar_events: [ ],
			file_resources: [],
			status_label: 'Pre-agendado',
			visit_number: 0,
			ibs_number: 'EEE458097890UOP'
			}
			],
		total: 11
	}
	"
  def index
    page = (params[:page].blank? ? 1 : params[:page])
    per_page = (params[:per_page].blank? ? 5 : params[:per_page])
    customer_id = (params[:customer_id].blank? ? '' : params[:customer_id])
    countries_iso = current_user.countries.pluck(:iso).join(',')
    country = (params[:country].blank? ? countries_iso : params[:country])
    keywords = (params[:keywords].blank? ? '' : params[:keywords])
    only_payed = (params[:only_payed].present? && params[:only_payed] == 'true')
    query_params = request.query_parameters
    render json: ApiSingleton.services_api(page, per_page, customer_id, country, keywords, only_payed, query_params)
  end

  def filter_options
    render json: ApiSingleton.filter_options
  end

  api :GET, '/v1/services/:id', 'Trae la información de un servicio en particular'
  param :id, String, desc: 'ID del servicio en particular'
  example 'Request: ' + Rails.application.config.site_url + "/api/v1/services/34\n
	Salida:
	{
		id: 34,
		customer_id: 1,
		address: 'principal',
		service_type: 'Instalación',
		subcategory: 'Profesional',
		requested: 'Cliente directo',
		request_channel: 'Teléfono',
		distributor_name: '',
		distributor_email: '',
		created_at: '18/12/2020 19:18:38',
		updated_at: '18/12/2020 19:18:38',
		technicians_number: 0,
		hour_amount: 0,
		fee_amount: 0,
		total_hours: 0,
		total_amount: 0,
		status: 'prescheduled',
		background: '5464654',
		no_payment: false,
		payment_channel: '',
		payment_date: '2020-12-11',
		no_payment_reason: '',
		invoice: false,
		payment_state: 'paid',
		job_id: '473803f0f2ebd77d83ee60daaa61f381',
		number: 'MTCL000088',
		address_fn: 'principal',
		cancel_reason: null,
		background_cancel_service: null,
		customer_payment_date: null,
		ibs_number: null,
		customer_products: [],
		service_products: [ ],
		spare_parts: [ ],
		calendar_events: [],
		file_resources: [ ],
		payment_resources: [ ],
		status_label: 'Agendado',
		visit_numb: null,
		service_technicians: []
	}
	"
  def show
    service = ApiSingleton.service_api(service_params)
    technicians_ids = begin
      service['calendar_events'].collect { |calendar_events| calendar_events['object_id'] }
    rescue StandardError
      []
    end
    service[:service_technicians] = Technician.where(id: technicians_ids)
    render json: service.to_json
  end

  api :GET, '/v1/services/:id/status_changes',
      'Trae la información de cambios de estado de un servicio en particular'
  param :id, String, desc: 'ID del servicio en particular'
  example 'Request: ' + Rails.application.config.site_url + "/api/v1/services/34/status_changes\n
	Salida:
	{
		[
			{
			  'id': 2,
			  'service_id': 48,
			  'from': 'new +3',
			  'to': 'new +4',
			  'changed_at': '2021-07-01T17:46:20.881-05:00',
			  'created_at': '2021-07-01T17:46:20.882-05:00',
			  'updated_at': '2021-07-01T17:46:20.882-05:00'
			},
			{
			  'id': 1,
			  'service_id': 48,
			  'from': 'new +2',
			  'to': 'new +3',
			  'changed_at': '2021-07-01T17:46:00.079-05:00',
			  'created_at': '2021-07-01T17:46:00.086-05:00',
			  'updated_at': '2021-07-01T17:46:00.086-05:00'
			}
		  ]

	}
	"
  def status_changes
    service = ApiSingleton.service_status_changes_api(service_params)
    render json: service.to_json
  end

  api :GET, '/v1/services/:id/status_label', 'Trae la información de cambios de estado de un servicio en particular'
  param :id, String, desc: 'ID del servicio en particular'
  example 'Request: ' + Rails.application.config.site_url + "/api/v1/services/34/status_changes\n
	Salida:
		{
			id: 1,
			status: 'presheduled',
			status_label: 'Pre-agendado'
		}
	"
  def status_label
    service = ApiSingleton.service_status_label_api(service_params)
    render json: service.to_json
  end

  api :GET, '/v1/services/:technician_id/technician', 'Servicios agendados para un técnico'
  param :technician_id, String, desc: 'ID del técnico en particular'
  param :page, String, desc: 'Pagina consultada 1..n'
  param :per_page, String, desc: 'Resultados por paǵina esperados'
  example 'Request: ' + Rails.application.config.site_url + "/api/v1/services?customer_id=48\n
	{
		page: 1,
		per_page: 10,
		data: [
			{
				id: 297,
				title: 'Agendamiento de servicio',
				start_date: '2020-12-11T14:00:00.000Z',
				finish_date: '2020-12-11T15:00:00.000Z',
				allDay: false,
				event_type: 'Service_Schedule',
				description: 'Agendamiento del servicio 47 para cliente 48',
				created_at: '2020-12-10T20:29:53.575Z',
				updated_at: '2020-12-10T20:29:53.575Z',
				country_id: 2,
				object_id: '16',
				service_id: 47,
				service: {
					id: 47,
					customer_id: 48,
					address: 'principal',
					service_type: 'Mantenimiento',
					subcategory: 'Certificado de servicio doméstico',
					requested: 'Cliente directo',
					request_channel: 'Teléfono',
					distributor_name: '',
					distributor_email: '',
					created_at: '02/12/2020 18:36:51',
					updated_at: '02/12/2020 18:36:51',
					technicians_number: 4,
					hour_amount: 8470,
					fee_amount: 12670,
					total_hours: 7,
					total_amount: 203040,
					status: 'paid',
					background: 'TEST',
					no_payment: false,
					payment_channel: 'phone',
					payment_date: '2020-12-31',
					no_payment_reason: 'Cortesía',
					invoice: false,
					payment_state: 'paid',
					job_id: '038d5463327addf90d282c35be4c5eb1',
					number: 'MTCL000047',
					address_fn: 'principal',
					cancel_reason: null,
					background_cancel_service: null,
					customer_payment_date: null,
					ibs_number: null,
					spare_part_delivery_date: null,
					principal_technician: null,
					customer_products: [],
					service_products: [],
					spare_parts: [],
					calendar_events: [],
					file_resources: [],
					payment_resources: [],
					status_label: 'Agendado',
					visit_numb: null
				}
			},
			{...},
			{...},
			{...},
			{...},
			{...}
		],
		total: 6
	}
	"
  def index_by_techinician
    page = (params[:page].blank? ? 1 : params[:page])
    per_page = (params[:per_page].blank? ? 10 : params[:per_page])
    technician_id = (params[:technician_id].blank? ? '' : params[:technician_id])
    render json:  ApiSingleton.services_technician_api(page, per_page, technician_id)
  end

  api :GET, '/v1/services/:id/total_price', 'Calcula el total de servicio'
  param :id, String, desc: 'ID del servicio en particular'
  param :country, String, desc: 'Pais donde se aplica el servicio'
  param :products_ids, String, desc: 'ID de los taxones de productos seleccionados, seperados por ,'
  param :service_type, String, desc: 'Tipo de servicio asociado'
  param :subcategory, String, desc: 'Subcategoria de tipo de servicio asociado'
  param :zipcode, String, desc: 'Codigo postal para clientes Mexicanos'
  param :administrative_demarcation_name, String, desc: 'Nombre de Comuna para clientes Chilenos'
  param :time_diff, String, desc: 'Tiempo de servicio. Si aplica'

  example 'Request: ' + Rails.application.config.site_url + "/api/v1/services/34/total_price?service_type=Home%20Program&products_ids=46,47,50,51&zipcode=8000000&country=MX\n
	Salida:
	{
		data: {
		total_technicians: 1,
		fee_amount: 10000,
		total_amount: 72000,
		total_hours: 2,
		consumable_amount: 0,
		hour_amount: 2000,
		labor_price: 0,
		viatic_value: 60000,
		customer_products: []
		}
	}
	"
  ## /api/v1/services/34/total_price?service_type=Home%20Program&products_ids=46,47,50,51&zipcode=8000000&country=MX
  def total_price
    ## FEE AMOUNTS BY COUNTRY
    extra_params = {}
    extra_params[:fee_amount] = params[:fee_amount] if params[:fee_amount].present?
    extra_params[:labor_price] = params[:labor_price] if params[:labor_price].present?
    extra_params[:viatic_value] = params[:viatic_value] if params[:viatic_value].present?
    extra_params[:quotation_id] = params[:quotation_id] if params[:quotation_id].present?

    render json: ApiSingleton.service_total_price_api(service_params, extra_params).to_json
  end

  api :POST, '/v1/services/:id/create_spare_part', 'Asigna una refacción a un cliente en Miele Core'
  param :id, String, desc: 'ID del cliente a asignar productos'
  param :products, String, desc: 'Array de ids de productos de refacción'
  example 'Request: ' + Rails.application.config.site_url + "/api/v1/services/1/create_spare_part\n
	Salida:
    {
        id: 1,
        service_id: 1,
        product_id: 1,
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
    }
    "
  def create_spare_part
    @service_product = ApiSingleton.get_create_service_spare_parts_api(service_spare_part_params)
    if begin
      @service_product['id']
    rescue StandardError
      false
    end
      render json: @service_product.to_json
    else
      render json: @service_product, status: :bad_request
    end
  end

  api :GET, '/v1/services/:id/spare_parts', 'Trae las refacciones asociadas de un servicio'
  param :id, String, desc: 'ID del servicio'
  example 'Request: ' + Rails.application.config.site_url + "/api/v1/services/1/spare_parts\n
	Salida:
    [
        {
            id: 1,
            service_id: 1,
            product_id: 1,
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
  def spare_parts
    response = ApiSingleton.get_service_spare_parts(service_spare_part_params)
    render json: response.to_json
  end

  api :GET, '/v1/services/:id/requested_spare_parts', 'Trae las refacciones asociadas de un servicio'
  param :id, String, desc: 'ID del servicio'
  example 'Request: ' + Rails.application.config.site_url + "/api/v1/services/1/requested_spare_parts\n
	Salida:
    [
        {
            id: 1,
            service_id: 1,
            product_id: 1,
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
    response = ApiSingleton.get_service_requested_spare_parts(service_spare_part_params)
    render json: response.to_json
  end

  api :GET, '/v1/services/:id/selected_spare_parts', 'Trae las refacciones seleccionadas asociadas de un servicio'
  param :id, String, desc: 'ID del servicio'
  example 'Request: ' + Rails.application.config.site_url + "/api/v1/services/1/selected_spare_parts\n
	Salida:
    [
        {
            id: 1,
            service_id: 1,
            product_id: 1,
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
  def selected_spare_parts
    response = ApiSingleton.get_service_selected_spare_parts(service_spare_part_params)
    render json: response.to_json
  end

  api :PATCH, '/v1/services/:id/spare_parts/:service_spare_part_id', 'Actualiza refacción a un cliente en Miele Core'
  param :id, String, desc: 'ID del servicio al que pertenece la refacción'
  param :service_spare_part_id, String, desc: 'ID de la refacción'
  param :quantity, String, desc: 'Cantidad de la refacción asignada'
  param :requested_quantity, String, desc: 'Cantidad solicitada de la refacción (para el módulo de solicitudes)'
  param :status, String, desc: 'Estado de la refacción solicitada. Dejar en blanco para eliminar de solicitud.'
  param :delivery_status, String, desc: 'Estado de entrega la refacción solicitada'
  param :background, String, desc: 'Antecedentes de la entrega de la refaccion'

  example 'Request: ' + Rails.application.config.site_url + "/api/v1/services/1/spare_parts/1\n
	Salida:
    {
        id: 1,
        service_id: 1,
		product_id: 1,
		quantity: 2
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
    }
    "
  def update_spare_part
    prev_spare_parts = ApiSingleton.get_service_requested_spare_parts({ id: service_spare_part_params[:id] })
    @service_spare_part = ApiSingleton.get_update_service_spare_parts_api(service_spare_part_params)
    if begin
      @service_spare_part['id']
    rescue StandardError
      false
    end
      Service.send_spare_parts_request_notification(service_spare_part_params[:id])
      next_spare_parts = ApiSingleton.get_service_requested_spare_parts({ id: service_spare_part_params[:id] })
      service = ApiSingleton.service_api({ id: service_spare_part_params[:id] })
      if prev_spare_parts &&
         next_spare_parts &&
         service['request_channel'].eql?('App Clientes') &&
         changed_to_all_delivered?(prev_spare_parts['data'], next_spare_parts['data'])
        Service.send_spare_parts_arrival_notification(service_spare_part_params[:id])
      end
      render json: @service_spare_part.to_json
    else
      render json: @service_spare_part, status: :bad_request
    end
  end

  api :POST, '/v1/services/:id/assign_spare_parts', 'Asigna refacciones a un técnico en Miele Core'
  param :id, String, desc: 'ID del servicio al que pertenece la refacción'
  param :service_spare_part_ids, String, desc: 'IDs de la refaccionnes separados por ,'
  param :technician_id, String, desc: 'ID del tecnico a asignar'
  example 'Request: ' + Rails.application.config.site_url + "/api/v1/services/1/assign_spare_parts\n
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
  def assign_spare_parts
    @service_spare_parts = ApiSingleton.get_assign_spare_parts_api(service_spare_part_params)
    if begin
      @service_spare_parts.any?
    rescue StandardError
      false
    end
      render json: @service_spare_parts.to_json
    else
      render json: @service_spare_parts, status: :bad_request
    end
  end

  api :GET, '/v1/services/:id/technician_spare_parts/:technician_id',
      'Trae las refacciones de un técnico en Miele Core'
  param :id, String, desc: 'ID del servicio al que pertenece la refacción'
  param :technician_id, String, desc: 'ID del tecnico a asignar'
  example 'Request: ' + Rails.application.config.site_url + "/api/v1/services/1/technician_spare_parts/1\n
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
    response = ApiSingleton.get_technician_service_products_api(service_spare_part_params)
    render json: response.to_json
  end

  api :GET, '/v1/services_all_technician_spare_parts/:technician_id',
      'Trae todas a recepcionar para un técnico en Miele Core'
  param :technician_id, String, desc: 'ID del tecnico a asignar'
  example 'Request: ' + Rails.application.config.site_url + "/api/v1/services_all_technician_spare_parts/1\n
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
    response = ApiSingleton.get_technician_all_service_products_api(service_spare_part_params)
    render json: response.to_json
  end

  api :GET, '/v1/technician_all_used_spare_parts/:technician_id',
      'Trae todas a recepcionar para un técnico en Miele Core'
  param :technician_id, String, desc: 'ID del tecnico a asignar'
  example 'Request: ' + Rails.application.config.site_url + "/api/v1/services_all_technician_spare_parts/1\n
	Salida:

		[
			{
				id: 2,
				customer_product_id: 1,
				service_spare_part_id: 1,
				quantity: 6,
				created_at: '2021-03-03T22:28:58.519Z',
				updated_at: '2021-03-03T22:30:06.419Z',
				service_spare_part: {}
			}
		]
	"
  def technician_all_used_spare_parts
    response = ApiSingleton.get_technician_all_service_used_products_api(service_spare_part_params)
    render json: response.to_json
  end

  api :DELETE, 'v1/services/:id/spare_parts/:spare_part_id', 'Elimina un producto a un servicio en Miele Core'
  param :id, String, desc: 'ID del cliente a eliminar el producto'
  param :spare_part_id, String, desc: 'ID del producto del cliente, que se quiere eliminar'
  example 'Request: ' + Rails.application.config.site_url + "/api/v1/customers/1/customer_product/1\n
	Salida:
        { service_spare_part_id: 1, message: 'Producto de servicio eliminado' }
    "
  def delete_spare_parts
    @service_spare_part = ApiSingleton.destroy_service_spare_part_api(params[:id],
                                                                      params[:service_spare_part_id])
    if begin
      @service_spare_part['service_spare_part_id']
    rescue StandardError
      false
    end
      render json: @service_spare_part.to_json
    else
      render json: @service_spare_part, status: :bad_request
    end
  end

  ########################
  ### Customer Services
  ########################

  api :POST, '/v1/services/:service_id/visits',
      'Crea o actualiza una nueva visita a un servicio a un cliente en Miele Core. Si existe una visita previa sin pagar, trae esa.'
  param :service_id, String, desc: 'ID del servicio'
  param :visit_id, String, desc: 'ID de la visita'
  param :customer_id, String, desc: 'ID del cliente a asignar el servicio'
  param :address, String, desc: "Dirección del cliente seleccionada. 'principal' o el id de alguna adicional"
  param :address_fn, String,
        desc: "Dirección de facturación del cliente seleccionada. 'principal' o el id de alguna adicional"
  param :service_type, String,
        desc: "Tipo de servicio del cliente. ['Instalación', 'Mantenimiento', 'Reparación', 'Home Program', 'Reparaciones en Taller', 'Entregas/Despachos']"
  param :subcategory, String, desc: 'Sub categoria del servicio del cliente'
  param :requested, String,
        desc: "Describe si el servicio es solicitado por 'Cliente directo'' o por 'Distribuidor autorizado'."
  param :request_channel, String,
        desc: "Canal de la solicitud de servicio. ['Teléfono', 'App Clientes', 'Web', 'Redes sociales'] "
  param :distributor_name, String, desc: 'Nombre del distribuidor autorizado, si aplica'
  param :distributor_email, String, desc: 'Email del distribuidor autorizado, si aplica'
  param :customer_products_id, String,
        desc: 'Array de ids de producos del usuario separados por coma (1,2,3), asociado al servicio'
  param :technicians_number, String, desc: 'Número de técnicos necesarios para el servicio'
  param :hour_amount, String, desc: 'Monto por cada hora de servicio'
  param :labor_amount, String, desc: 'Monto de mano de obra por viaticos'
  param :subtotal_amount, String, desc: 'Monto subtotal del servicio'
  param :iva_amount, String, desc: 'Monto iva del servicio'
  param :fee_amount, String, desc: 'Monto de fee por viaticos'
  param :total_hours, String, desc: 'Total de horas del servicio'
  param :total_amount, String, desc: 'Monto total del servicio'
  param :status, String, desc: "Estado en el que se encuentra el serivio ['new','paid','completed']"
  param :background, String, desc: 'Antecedentes extras al servicio solicitado'
  param :no_payment, String, desc: 'true o false si es que se realiza pago o no'
  param :payment_channel, String, desc: 'Canal del pago si se realiza (Online, Transferencia, Por Teléfono)'
  param :payment_date, String, desc: 'Fecha límite de pago'
  param :no_payment_reason, String, desc: 'Razón de no pago'
  param :invoice, String, desc: 'true o false si el cliente requiere factura o no'
  param :event_start, String, desc: 'Fecha y hora de inicio del evento de agendamiento'
  param :event_end, String, desc: 'Fecha y hora de fin del evento de agendamiento'
  param :technicians_ids, String, desc: 'IDs de los técnicos separados por coma'
  param :images, Array,
        desc: 'Array de imagenes a asociar images:[{uri: [path de la imagen], mime: [formato], uri_64: [imagen en base 64], filename: [nombre imagen}]'
  param :payment_state, String, desc: 'Esto del pago (pendding, paid, failure)'
  param :isPaymentEmail, String,
        desc: "Valor booleano para determinar envío de correo de pago. Envar 'true' para efectuar envío. "
  param :customerEmail, String, desc: 'Email del cliente que recibirá el correo'
  param :paymentEmailAdditional, String, desc: 'Email adicional del cliente que recibirá el correo'
  param :from, String,
        desc: "Aplicación desde donde se esta generado el servicio. Use el valor 'app_web' para miele tickets web, 'app_clientes' y 'app_tecnicos' para las aplicaciones respectivas."

  example 'Request: ' + Rails.application.config.site_url + "/api/v1/services/1/visits\n
    Salida:
    {
        id: 51,
		principal_technician_id: '1',
		total_time: null,
		confirmed: false,
		invoice: false,
		background: 'Tercera visita del servicio MTCL00001',
		created_at: '2021-05-19T18:46:28.653Z',
		updated_at: '2021-05-19T18:48:26.855Z',
		service_id: 19,
		start_time: null,
		finish_time: null,
		time_diff: 0,
		canceled_at: null,
		cancel_from: null,
		cancel_reason: null,
		arrival_time: null,
		arrival_time_diff: 0,
		payment_date: null,
		payment_state: 'pending',
		status: 'new',
		validated_payment: false,
		payment_channel: 'phone',
		customer_payment_date: null,
		number: 3,
		calendar_event: null,
		status_label: 'Pre-agendada',
		payment_resources: [ ],
		hour_amount: 0,
		fee_amount: 0,
		total_hours: 0,
		total_amount: 0,
		subtotal_amount: 0,
		viatic_amount: 0
        }
    "
  def create_visit
    @customer_visit = ApiSingleton.get_create_customer_visit_api(create_visit_params)
    if begin
      @customer_visit['id']
    rescue StandardError
      false
    end
      UserNotification.notify_service_visit_prescheduled(@customer_visit, 'visit')
      render json: @customer_visit.to_json
    else
      render json: @customer_visit, status: :bad_request
    end
  end

  api :PATCH, '/v1/services/:id/visits/:visit_id/update_visit',
      'Actualiza una visita de un servicio a un cliente en Miele Core'
  param :id, String, desc: 'ID del servicio al que pertenece la visita'
  param :visit_id, String, desc: 'ID de la visita que se quiere actualizar'
  param :technicians_ids, String, desc: 'Técnicos asociados a la visita'
  param :event, String, desc: 'Fecha asignada para la visita en formato {start: fecha end: fecha}'
  param :person_accountable, String, desc: 'El nombre completo de quien atendió la visita'
  param :signature, String, desc: 'Foto de la firma, en Base64'
  param :payment_files, Array,
        desc: 'Array de archivos asociados al pago payment_files:[{uri: [path de la imagen], mime: [formato], uri_64: [imagen en base 64], filename: [nombre imagen}]'

  example 'Request: ' + Rails.application.config.site_url + "/api/v1/services/1/visits/1/update_visit\n
	Salida:
    {

    }
    "
  def update_visit
    @customer_visit = ApiSingleton.get_update_service_visit_api(params)
    if begin
      @customer_visit['id']
    rescue StandardError
      false
    end
      render json: @customer_visit.to_json
    else
      render json: @customer_visit, status: :bad_request
    end
  end

  api :POST, '/v1/services/:id/visits/:visit_id/cancel_visit',
      'Actualiza una visita de un servicio a un cliente en Miele Core'
  param :id, String, desc: 'ID del servicio al que pertenece la visita'
  param :visit_id, String, desc: 'ID de la visita que se quiere cancelar'
  param :cancel_from, String, desc: 'cancel_from de la visita que se quiere cancelar'
  param :cancel_reason, String, desc: 'cancel_reason de la visita que se quiere cancelar'
  param :status, String, desc: 'Estado de la visita'

  example 'Request: ' + Rails.application.config.site_url + "/api/v1/services/1/visits/1/cancel_visit\n
	Salida:
    {

    }
    "
  def cancel_visit
    @visit = ApiSingleton.get_cancel_service_visit_api(visit_params)
    if begin
      @visit['id']
    rescue StandardError
      false
    end
      render json: @visit.to_json
    else
      render json: @visit, status: :bad_request
    end
  end

  api :GET, '/v1/services/:id/customer_complaints', 'Trae las quejas de cliente de un servicio en Miele Core'
  param :id, String, desc: 'ID del servicio al que pertenece la refacción'
  example 'Request: ' + Rails.application.config.site_url + "/api/v1/services/1/customer_complaints/1\n
	Salida:
    [
		{
		  'id': 1,
		  'service_id': 1,
		  'customer_id': 1,
		  'complaint_type': 'RETRASO EN SERVICIO',
		  'channel': 'Contact Center',
		  'phone': '(+56) 23214123123',
		  'complaint_background': 'TEST',
		  'compensation_proposal': ',
		  'closure_details': ',
		  'created_at': '2021-06-11T20:36:57.038Z',
		  'updated_at': '2021-06-11T20:36:57.038Z'
		}
	  ]
    "
  def customer_complaints
    render json:  ApiSingleton.services_customer_complaints_api(params[:id])
  end

  # def services_report_excel()
  # 	start_date =  params["start"].blank? ? "" :  params["start"] #Date.parse params["start"]
  # 	finish_date = params["finish"].blank? ? "" : params["finish"]#Date.parse params["finish"]
  # 	quantity = 1
  # 	i = 1
  # 	@services_all = []
  # 	while quantity != 0
  # 		aux = ApiSingleton.services_api(i.to_s,"90000000000000", "", "", "",false,start_date,finish_date)["data"]
  # 		if aux.length !=0
  # 			aux.each do |c|
  # 				aux_2 = ApiSingleton.service_api({id: c["id"].to_s})
  # 				technicians_ids = aux_2["calendar_events"].collect{|calendar_events| calendar_events["object_id"]} rescue []
  # 				principal_technician = Technician.where(id: technicians_ids[0]).take
  # 				aux_2["principal_technician_name"] = principal_technician.user.fullname if principal_technician
  # 				@services_all.push(aux_2);
  # 			end
  # 			i = i + 1
  # 		else
  # 			quantity = 0
  # 		end
  # 	end
  # 	#render del excel pa que se descargue, esto redirecciona a la vista
  #     respond_to do |format|
  #         format.xlsx {
  #         render xlsx: 'services_report_excel',
  #                 filename: "Servicios #{Date.today.strftime('%d-%m-%Y')}.xlsx"
  #         }
  #     end

  # end

  def services_report_excel
    start_date =  params['start'].blank? ? '' : params['start'] # Date.parse params["start"]
    finish_date = params['finish'].blank? ? '' : params['finish'] # Date.parse params["finish"]
    data_download  = DataDownload.create!(data_type: "DataDownload",description: "Servicios entre: #{Date.parse(start_date).strftime('%d/%m/%Y')} y #{Date.parse(finish_date).strftime('%d/%m/%Y')}", user_id: current_user.id, finished: false)
    DataDownloadWorker.perform_async(start_date, finish_date, data_download.id)
    redirect_to "/data_download", success: "Se ha ingresado una soliciud de descarga, puede comprobarla en la sección"
  end



  private

  def send_payment_email
    if begin
      (@customer_visit['id'] && @customer_visit['status'] == 'created')
    rescue StandardError
      false
    end
      emails = (@customer_visit['customer_email'].blank? ? 'oferusat@gmail.com' : @customer_visit['customer_email'])
      emails += ",#{params[:paymentEmailAdditional]}" unless params[:paymentEmailAdditional].blank?
      begin
        NotificationMailer.payment_email(emails, @customer_visit['service_id'].to_s, 'visit',
                                         @customer_visit['id'].to_s).deliver_now
      rescue StandardError
        puts 'No se ha podido enviar el email.'
      end
    end
  end

  def changed_to_all_delivered?(prev_data, next_data)
    prev_delivered_count = 0
    next_delivered_count = 0
    prev_data.each do |spare_part|
      prev_delivered_count += 1 if spare_part['delivery_status'].eql?('delivered')
    end

    puts("prev_delivered_count: #{prev_delivered_count}")
    if prev_delivered_count < prev_data.count
      next_data.each do |spare_part|
        next_delivered_count += 1 if spare_part['delivery_status'].eql?('delivered')
      end
      next_delivered_count.eql?(next_data.count)
    else
      false
    end
  end

  def service_params
    params.permit :id, :password, :country, :products_ids, :service_type, :subcategory, :zipcode,
                  :administrative_demarcation_name, :time_diff
  end

  def create_visit_params
    params.permit(:id, :service_id, :policy_id, :visit_id, :from, :customer_id, :address, :address_fn, :service_type,
                  :subcategory, :requested, :request_channel, :distributor_name, :distributor_email,
                  :technicians_number, :labor_amount, :viatic_amount, :hour_amount, :fee_amount,
                  :total_hours, :subtotal_amount, :iva_amount, :total_amount, :status, :customer_products_id,
                  :background, :no_payment, :payment_channel, :payment_date, :no_payment_reason, :invoice,
                  :event_start, :event_end, :technicians_ids, :payment_state, :customer_payment_date,
                  :spare_parts_amount, :assigned_quotation_id, images: [], consumables: [])
  end

  def service_spare_part_params
    params.permit :id, :products, :quantity, :service_spare_part_id, :service_spare_part_ids, :technician_id,
                  :requested_quantity, :status, :delivery_status, :background
  end

  def visit_params
    params.permit :id, :visit_id, :technicians_ids, :event_start, :event_end, :confirmed, :cancel_from,
                  :cancel_reason, :signature, :status, :person_accountable
  end
end

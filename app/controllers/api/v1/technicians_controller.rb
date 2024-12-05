class Api::V1::TechniciansController < ApplicationController
  protect_from_forgery with: :null_session
  skip_before_action :authenticate_user!
  include ActionController::HttpAuthentication::Token::ControllerMethods
  before_action :authenticate

  before_action :set_technician, only: %i[show edit update destroy]
  after_action :save_activities, only: %i[create update]
  after_action :save_taxons, only: %i[create update]
  after_action :save_photo, only: %i[create update]
  after_action :save_events, only: %i[create update]

  api :GET, '/v1/technicians', 'Retorna los técnicos filtrados y paginados'
  param :page, String, desc: 'Pagina consultada 1..n'
  param :per_page, String, desc: 'Resultados por paǵina esperados'
  param :keywords, String, desc: 'Filtro de texto para encontrar al ténico'
  param :country, String, desc: 'País de los técnicos'
  example 'Request: ' + Rails.application.config.site_url + "/api/v1/technicians?page=2&country=CL\n
	Salida:
        {
            page: 2,
            per_page: 10,
            data: [
                {... technician},
                {... technician},
                {... technician},
                {... technician},
                {... technician},
                {... technician},
                {... technician},
                {... technician},
                {... technician},
                {... technician}
            ],
            total: 48
        }
	"
  def index
    response = {}
    response['page'] = params[:page].blank? ? 1 : params[:page].to_i
    response['per_page'] = params[:per_page].blank? ? 10 : params[:per_page].to_i
    technicians = (params[:keywords].blank? ? Technician : Technician.search(params[:keywords]))
    unless params[:country].blank?
      technicians = technicians.joins(user: :countries).where('countries.iso = ?', params[:country])
    end
    technicians = technicians.order(created_at: :desc).paginate(page: params[:page], per_page: params[:per_page])
    response['data'] = technicians
    response['total'] = technicians.total_entries
    render json: response.to_json
  end

  def all_technicians
    country = params[:country]

    response = Technician.all
    response = Technician.joins(user: :countries).where('countries.iso = ?', country) if country.present?

    render json: response.to_json, status: :ok
  end

  api :GET, '/v1/get_technicians_by_taxon', 'Retorna los técnicos filtrados por taxon'
  param :country, String, desc: 'País de los técnicos'
  param :zone, String, desc: 'Código postal para clientes mexicanos, Comunas para clientes Chilenos'
  param :taxons_ids, String, desc: 'ID de los taxones de productos seleccionados, seperados por ,'
  param :taxons_names, String,
        desc: 'Nombres de los taxones de productos seleccionados, seperados por ,. Excluyente al id.'
  param :taxon_type, String,
        desc: "Tipo de servicio. ('Instalación', 'Mantenimiento', 'Reparación', 'Home Program', 'Reparaciones en Taller', 'Entregas/Despachos')"
  example 'Request: ' + Rails.application.config.site_url + "/api/v1/get_technicians_by_taxon?country=MX&zone=012000&taxons_ids=1,2,3&taxon_type=Reparación\n
	Salida:
	{
		{
			data: [
				{
					id: 13,
					n_store: 'qwe TEST',
					user_id: 24,
					vehicle_info: 'qwe',
					vehicle_license: 'qwe',
					created_at: '16/10/2020 12:39:20',
					updated_at: '22/10/2020 16:40:23',
					photo: null,
					jobs_count: 0,
					technician_taxons_grouped: {},
					technician_taxons: [],
					user: {
						id: 27,
						firstname: 'TEST FIRSTNAME',
						lastname: ' TEST LASTNAME ',
						created_at: '08/10/2020 14:33:42',
						updated_at: '11/11/2020 12:11:03',
						email: 'CLIENTE@TEST.COM',
						surname: 'TEST SURNAME',
						cellphone: '(+56) 123456',
						phone: '(+56) 123451',
						cost_center: 'test1',
						role_id: 'CODE1',
						worktime: 'Part-Time',
						photo: null,
						api_key: '',
						customer_id: '1',
						from_auth: 'app_clientes',
						country: 'MX',
						get_roles_names: 'Técnico',
						countries: [{}],
						fullname: 'TEST FIRSTNAME TEST LASTNAME TEST SURNAME'
					}
				}

			],
			others: [
			{
				id: 11,
				n_store: '123',
				user_id: 27,
				vehicle_info: '123',
				vehicle_license: '123',
				created_at: '14/10/2020 18:55:18',
				updated_at: '14/10/2020 18:55:18',
				photo: null,
				jobs_count: 0,
				technician_taxons_grouped: {},
				technician_taxons: [],
				user: {}
				}
			]
		}
	}
	"
  def get_technicians_by_taxon
    response = {}

    if params[:taxons_names].blank?
      current_technician, others_technicians = (if params[:taxons_ids].blank?
                                                  Technician
                                                else
                                                  Technician.search_by_taxon_id(
                                                    params[:taxons_ids], params[:taxon_type], params[:country], params[:zone]
                                                  )
                                                end)
    else
      current_technician, others_technicians = (if params[:taxons_names].blank?
                                                  Technician
                                                else
                                                  Technician.search_by_taxons_names(
                                                    params[:taxons_names], params[:taxon_type], params[:country], params[:zone]
                                                  )
                                                end)
    end
    current_technician_ids = current_technician.pluck(:id).join(',').inspect
    others_technicians_ids = others_technicians.pluck(:id).join(',').inspect

    current_wordload = ApiSingleton.technician_work_load_api(current_technician_ids)
    others_wordload = ApiSingleton.technician_work_load_api(others_technicians_ids)

    current_technician.each do |technician|
      if current_wordload['data'][technician.id.to_s] && current_wordload['data'][technician.id.to_s] != technician.jobs_count
        technician.update(jobs_count: current_wordload['data'][technician.id.to_s])
      end
    end

    others_technicians.each do |technician|
      if others_wordload['data'][technician.id.to_s] && others_wordload['data'][technician.id.to_s] != technician.jobs_count
        technician.update(jobs_count: others_wordload['data'][technician.id.to_s])
      end
    end

    response['data'] = current_technician.order(jobs_count: :asc)
    response['others'] = others_technicians.order(jobs_count: :asc)
    render json: response.to_json
  end

  api :GET, '/v1/get_technicians', "Retorna los usuarios con rol 'técnico' y filtrados"
  param :keywords, String, desc: 'Filtro de texto para encontrar al ténico'
  example 'Request: ' + Rails.application.config.site_url + "/api/v1/get_technicians?country=CL\n
	Salida:
	[
		{
			value: '27',
			label: 'TEST 1 (TEST1@TEST1.cl)'
		},
		{
			value: '24',
			label: 'TEST 2 (TEST2@TEST2.cl)'
		},
		{
			value: '9',
			label: 'TEST 3 (TEST3@TEST3.cl)'
		},
			{
			value: '8',
			label: 'TEST 4 (TEST4@TEST4.cl)'
		},
		{
			value: '2',
			label: 'TEST 5 (TEST5@TEST5.cl)'
		}
	]
	"
  def get_technicians
    response = []
    users = (params[:keywords].blank? ? User : User.search(params[:keywords]))
    used_tech = Technician.pluck(:user_id).uniq
    users = users.joins(:user_roles).where('user_roles.role_id = ?', Role.find_or_create_by(name: 'Técnico').id).where.not(id: used_tech).order(created_at: :desc).paginate(
      page: params[:page], per_page: params[:per_page]
    )
    users.each do |user|
      response << { value: user.id.to_s, label: "#{user.fullname} (#{user.email})" }
    end
    render json: response.to_json
  end

  api :GET, '/v1/technicians/:id', 'Retorna un técnico mediante su id'
  param :id, String, desc: 'ID del técnico consultado'
  example 'Request: ' + Rails.application.config.site_url + "/api/v1/technicians/2\n
	Salida:
	{
		data: {
			id: 1,
			n_store: 'TEST',
			user_id: 2,
			vehicle_info: 'test',
			vehicle_license: 'test',
			created_at: '22/10/2020 16:40:41',
			updated_at: '11/11/2020 14:46:01',
			photo: 'photo_url',
			jobs_count: 17,
			technician_taxons_grouped: {
				installation: [
					{
						id: 1,
						technician_id: 2,
						taxon_id: 123,
						taxon_type: 'installation',
						created_at: '2020-11-17T14:51:43.678-06:00',
						updated_at: '2020-11-17T14:51:43.678-06:00'
					},
					{...}
				],
				maintenance: [
					{
					id: 2,
					technician_id: 2,
					taxon_id: 124,
					taxon_type: 'maintenance',
					created_at: '2020-11-17T14:51:43.809-06:00',
					updated_at: '2020-11-17T14:51:43.809-06:00'
					},
					{...}
			},
			technician_taxons: [
				{
				id: 1,
				technician_id: 2,
				taxon_id: 123,
				taxon_type: 'installation',
				created_at: '2020-11-17T14:51:43.678-06:00',
				updated_at: '2020-11-17T14:51:43.678-06:00'
				},
				{...},
				{...},
			],
			user: {
				id: 2,
				firstname: 'TESTF',
				lastname: 'TESTL',
				created_at: '18/08/2020 19:04:04',
				updated_at: '05/11/2020 14:04:01',
				email: 'TESTF.TESTL@TEST.cl',
				surname: 'TESTS',
				cellphone: '1234567',
				phone: '12345678',
				cost_center: 'TEST',
				role_id: 'TEST',
				worktime: 'Part-Time',
				photo: null,
				api_key: null,
				customer_id: null,
				from_auth: '',
				country: 'CL',
				get_roles_names: 'TEST',
				countries: [
					{
					id: 22,
					name: 'Chile',
					iso: 'CL',
					created_at: '2020-09-01T14:03:12.703-05:00',
					updated_at: '2020-09-01T14:03:12.703-05:00'
					}
				],
				fullname: 'TESTF TESTL TESTS'
			},
			activities: [
				{
					id: 2,
					name: 'Mantenimiento',
					created_at: '2020-08-21T15:56:09.408-05:00',
					updated_at: '2020-08-21T15:56:09.408-05:00'
				},
				{
					id: 4,
					name: 'Diagnóstico en Taller',
					created_at: '2020-08-21T15:56:09.418-05:00',
					updated_at: '2020-08-21T15:56:09.418-05:00'
				},
				{
					id: 1,
					name: 'Instalación',
					created_at: '2020-08-21T15:56:09.403-05:00',
					updated_at: '2020-08-21T15:56:09.403-05:00'
				}
			]
		}
	}
	"
  def show
    response = {}
    response['data'] = @technician
    render json: response.to_json(include: %i[user activities],
                                  methods: %i[technician_taxons_grouped
                                              technician_taxons])
  end

  api :POST, '/v1/technicians', 'Crea un técnico en Tickets'
  param :n_store, String, desc: 'n_store del técnico a crear'
  param :user_id, String, desc: "ID del usaurio con rol 'técnio' a asociar"
  param :vehicle_info, String, desc: 'vehicle_info del técnico a crear'
  param :vehicle_license, String, desc: 'vehicle_license del técnico a crear'
  example 'Request: ' + Rails.application.config.site_url + "/api/v1/technicians\n
	Salida:
	{
		data: {
			id: 1,
			n_store: 'TEST2',
			user_id: 2,
			vehicle_info: 'TEST2',
			vehicle_license: 'TEST2',
			created_at: '22/10/2020 16:40:41',
			updated_at: '11/11/2020 14:46:01',
			photo: 'photo_url',
			jobs_count: 17,
			technician_taxons_grouped: {...},
			technician_taxons: [{...}],
			user: {...},
			activities: [{...}]
		}
	}
	"
  def create
    @technician = Technician.create(technician_params)
    if @technician.id
      if params[:zoneFile].blank?
        render json: @technician.to_json
      else
        errors = save_zipcodes(params)
        if errors.any?
          flash[:errors] = true
          render json: errors.to_json, status: :bad_request
        else
          render json: @technician.to_json
        end
      end
    else
      render json: @technician.errors.full_messages, status: :bad_request
    end
  end

  api :PATCH, '/v1/technicians/:id', 'Actualiza un técnico en Tickets'
  param :id, String, desc: 'id del técnico a actualizar'
  param :n_store, String, desc: 'n_store del técnico a actualizar'
  param :user_id, String, desc: "ID del usaurio con rol 'técnio' a asociar"
  param :vehicle_info, String, desc: 'vehicle_info del técnico a actualizar'
  param :vehicle_license, String, desc: 'vehicle_license del técnico a actualizar'
  example 'Request: ' + Rails.application.config.site_url + "/api/v1/technicians/1\n
	Salida:
	{
		data: {
			id: 1,
			n_store: 'TEST2 updated',
			user_id: 2,
			vehicle_info: 'TEST2 updated',
			vehicle_license: 'TEST2 updated',
			created_at: '22/10/2020 16:40:41',
			updated_at: '11/11/2020 14:46:01',
			photo: 'photo_url',
			jobs_count: 17,
			technician_taxons_grouped: {...},
			technician_taxons: [{...}],
			user: {...},
			activities: [{...}]
		}
	}
	"
  def update
    if @technician.update(technician_params)
      if params[:zoneFile].blank?
        render json: @technician.to_json
      else
        errors = save_zipcodes(params)
        if errors.any?
          flash[:errors] = true
          render json: errors.to_json, status: :bad_request
        else
          render json: @technician.to_json
        end
      end

    else
      render json: @technician.errors.full_messages, status: :bad_request
    end
  end

  api :DELETE, '/v1/technicians/:id', 'Elimina un técnico en Tickets'
  param :id, String, desc: 'id del técnico a eliminar'
  example 'Request: ' + Rails.application.config.site_url + "/api/v1/technicians/1\n
	Salida:
		{ user_id: 1, message: 'Tecnico eliminado' }
	"
  def destroy
    user_id = @technician.id
    @technician&.destroy
    render json: { user_id: user_id, message: 'Tecnico eliminado' }.to_json
  end

  api :GET, '/v1/technicians/:id/reintegrated_spare_parts', "Retorna los usuarios con rol 'técnico' y filtrados"
  param :keywords, String, desc: 'Filtro de texto para encontrar al ténico'
  example 'Request: ' + Rails.application.config.site_url + "/api/v1/technicians/1/reintegrated_spare_parts?country=CL\n
	Salida:
	[

	]
	"
  def reintegrated_spare_parts
    response = ApiSingleton.reintegrated_spare_parts_api(params[:id])
    render json: response.to_json
  end

  private

  def set_technician
    @technician ||= Technician.find(params[:id])
  end

  def technician_params
    params.permit(:id, :n_store, :user_id, :vehicle_info, :vehicle_license, :enterprise)
  end

  def save_zipcodes(params)
    file = params[:zoneFile]
    sp = open_spreadsheet(file)
    sheets = sp.try(:sheets)
    begin
      zipcodes_cl = sp.sheet('Chile').dup
      zipcodes_mx = sp.sheet('México').dup
    rescue StandardError
      zipcodes_cl = nil
      zipcodes_mx = nil
    end

    headers = []
    message = ''

    begin
      zipcodes_mx.row(1).each_with_index { |header, _i| headers.push(header)	}
      message = 'Revise los encabezados del archivo, no son los indicados.'
    rescue StandardError
      headers = []
      message = 'El archivo no es el correcto.'
    end

    if !headers.include? 'Código Postal' or !headers.include? 'Borrar'
      redirect_to request.env['HTTP_REFERER'], alert: message
      return
    end

    headers = []
    message = ''

    begin
      zipcodes_cl.row(1).each_with_index { |header, _i| headers.push(header)	}
      message = 'Revise los encabezados del archivo, no son los indicados.'
    rescue StandardError
      headers = []
      message = 'El archivo no es el correcto.'
    end

    if !headers.include? 'Comunas' or !headers.include? 'Borrar'
      redirect_to request.env['HTTP_REFERER'], alert: message
      return
    end

    errors = @technician.create_zipcodes(zipcodes_mx, 'MX')
    @technician.create_zipcodes(zipcodes_cl, 'CL')
  end

  def save_photo
    if File.file?(params[:file])
      # The data is a file upload coming from <input type="file" />
      @technician.avatar.attach(params[:file])
      # Generate a url for easy display on the front end
      @technician.photo = url_for(@technician.avatar)
      @technician.save
    end
  end

  def save_activities
    new_activities = params[:activities].split(',')
    @technician.activities.destroy_all
    new_activities.each do |activity|
      new_activity = Activity.find_by(name: activity)
      @technician.activities << new_activity unless new_activity.nil?
    end
  end

  def save_taxons
    installation = ApiSingleton.taxon_names_api(params[:checkedinstallation])['data']
    maintenance = ApiSingleton.taxon_names_api(params[:checkedmaintenance])['data']
    repair = ApiSingleton.taxon_names_api(params[:checkedrepair])['data']
    diagnosis = ApiSingleton.taxon_names_api(params[:checkeddiagnosis])['data']
    home_program = ApiSingleton.taxon_names_api(params[:checkedhome_program])['data']
    delivery = ApiSingleton.taxon_names_api(params[:checkeddelivery])['data']

    to_taxon_family(@technician, installation, 'installation')
    to_taxon_family(@technician, maintenance, 'maintenance')
    to_taxon_family(@technician, repair, 'repair')
    to_taxon_family(@technician, diagnosis, 'diagnosis')
    to_taxon_family(@technician, home_program, 'home_program')
    to_taxon_family(@technician, delivery, 'delivery')
  end

  def save_events
    unless @technician.nil?
      begin
        new_events = JSON.parse(params[:technicians_events])
      rescue StandardError
        new_events = []
      end
      if new_events.any?
        ApiSingleton.create_technician_events_api(@technician.id, @technician.user.country,
                                                  new_events)
      end
    end
  end

  def to_taxon_family(technician, taxon_array, family_name)
    technician.technician_taxons.where(taxon_type: family_name).destroy_all
    if !taxon_array.nil? && taxon_array.size > 0
      taxon_array.each do |taxon|
        new_taxon = technician.technician_taxons.new(taxon_id: taxon['id'], taxon_name: taxon['name'],
                                                     taxon_type: family_name)
        new_taxon.save unless new_taxon.nil?
      end
    end
  end

  def open_spreadsheet(file)
    case File.extname(file.original_filename)
    when '.csv' then Roo::Csv.new(file.path)
    when '.xls' then Roo::Excel.new(file.path)
    when '.xlsx' then Roo::Excelx.new(file.path)
    else "El archivo no es del tipo correcto: #{file.original_filename}"
    end
  end
end

class Api::V1::UsersController < ApplicationController
  protect_from_forgery with: :null_session
  skip_before_action :authenticate_user!
  include ActionController::HttpAuthentication::Token::ControllerMethods
  before_action :authenticate

  before_action :set_user, only: [:show, :edit, :update, :destroy, :notifications, :notification_read, :notifications_unread, :to_disable]
  after_action :send_welcome_email, only: [:create]
  after_action :save_roles, only: [:create, :update]
  after_action :save_countries, only: [:create, :update]

  api :GET, "/v1/users", "Retorna los usuarios filtrados y paginados"
  param :page, String, desc: "Pagina consultada 1..n"
  param :per_page, String, desc: "Resultados por paǵina esperados"
  param :keywords, String, desc: "Filtro de texto para encontrar al usuario"
  example "Request: " + Rails.application.config.site_url + "/api/v1/users?page=2\n
	Salida:
        {
            page: 2,
            per_page: 10,
            data: [
                {... user},
                {... user},
                {... user},
                {... user},
                {... user},
                {... user},
                {... user},
                {... user},
                {... user},
                {... user}
            ],
            total: 48
        }
	"
  def index
    response = {}
    response["page"] = params[:page].blank? ? 1 : params[:page].to_i
    response["per_page"] = params[:per_page].blank? ? 10 : params[:per_page].to_i
    users = (params[:keywords].blank? ? User : User.search(params[:keywords]))
    users = users.order(created_at: :desc).paginate(page: params[:page], per_page: params[:per_page])
    response["data"] = users
    response["total"] = users.total_entries
    render json: response.to_json
  end

  api :GET, "/v1/users/:id", "Retorna un usuarios mediante su ID"
  param :id, String, desc: "ID del usuario consultado"
  example "Request: " + Rails.application.config.site_url + "/api/v1/users/1\n
	Salida:
	{
		data: {
			id: 1,
			firstname: 'TESTF',
			lastname: 'TESTL',
			created_at: '20/11/2020 11:26:05',
			updated_at: '20/11/2020 11:26:05',
			email: 'TESTF@TEST.TEST',
			surname: 'TESTS',
			cellphone: '(+56) 23423424 ',
			phone: '(+56) 23434234 ',
			cost_center: 'test1',
			role_id: 'CODE2',
			worktime: 'Full-Time',
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
		}
	}
	"
  def show
    response = {}
    response["data"] = @user
    render json: response.to_json(include: [:roles, :countries, :technician])
  end

  api :POST, "/v1/users", "CREA un usuario en Tickets"
  param :firstname, String, desc: "firstname del nuevo usuario"
  param :lastname, String, desc: "lastname del nuevo usuario"
  param :email, String, desc: "email del nuevo usuario"
  param :password, String, desc: "password del nuevo usuario"
  param :surname, String, desc: "surname del nuevo usuario"
  param :cellphone, String, desc: "cellphone del nuevo usuario"
  param :phone, String, desc: "phone del nuevo usuario"
  param :cost_center, String, desc: "cost_center del nuevo usuario"
  param :roleName, String, desc: "Nombre de los roles del usuario (Administrador, Contact Center, Technical Management, Field Service, Técnico, Cliente)"
  param :worktime, String, desc: "worktime del nuevo usuario  (Full Time, Part Time)"
  param :country, String, desc: "Paises del usuario con su ISO separado por comas (CL,MX)"
  param :customer_user, String, desc: "Validador de creación de clientes en el CORE."
  param :rfc, String, desc: "RFC para mexico"
  param :rut, String, desc: "RUT para Chile"
  param :disabled, String, desc: "Indica si un usuario puede usar los servicios"

  example "Request: " + Rails.application.config.site_url + "/api/v1/users\n
	Salida:
	{
		id: 1,
		firstname: 'TESTF',
		lastname: 'TESTL',
		created_at: '20/11/2020 11:26:05',
		updated_at: '20/11/2020 11:26:05',
		email: 'TESTF@TEST.TEST',
		surname: 'TESTS',
		cellphone: '(+56) 23423424 ',
		phone: '(+56) 23434234 ',
		cost_center: 'test1',
		role_id: 'CODE2',
		worktime: 'Full-Time',
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
	}
	"
  def create
    @user = User.create(user_params)
    if @user.id
      @user.update(disabled: params[:disabled]) if params[:disabled]
      new_roles = begin
        params[:roleName].split(",")
      rescue
        []
      end
      if !params[:customer_user].blank? || new_roles.include?("Cliente")
        customer_params_t = {
          names: user_params[:firstname],
          lastname: user_params[:lastname],
          surname: user_params[:surname],
          email: user_params[:email],
          # zipcode: "",
          # state: "",
          # delegation: "",
          # colony: "",
          # street_type: "",
          # street_name: "",
          # ext_number: "",
          # int_number: "",
          phone: user_params[:phone],
          cellphone: user_params[:cellphone],
          # reference: "",
          # business_name: "",
          rfc: params[:rfc].to_s,
          # email_fn: "",
          # zipcode_fn: "",
          # state_fn: "",
          # delegation_fn: "",
          # colony_fn: "",
          # street_type_fn: "",
          # street_name_fn: "",
          # ext_number_fn: "",
          # int_number_fn: "",
          # phone_fn: "",
          # person_type: "",
          country: begin
            params[:country].split(",")[0]
          rescue
            ""
          end,
          rut: params[:rut].to_s,
          email2: params[:email2]
          # commercial_business: "",
          # tradename: "",
          # customer_id: ""
        }
        @customer = ApiSingleton.create_customer_api(customer_params_t)
        if begin
          @customer["id"]
        rescue
          false
        end
          @user.customer_id = @customer["id"]
          @user.save
        end
      end
      render json: @user.to_json
    else
      render json: @user.errors.full_messages, status: :bad_request
    end
  end

  api :PATCH, "/v1/users/:id", "ACTUALIZA un usuario en Tickets"
  param :ID, String, desc: "ID del usuario"
  param :firstname, String, desc: "firstname del usuario"
  param :lastname, String, desc: "lastname del usuario"
  param :email, String, desc: "email del usuario"
  param :password, String, desc: "password del usuario"
  param :surname, String, desc: "surname del usuario"
  param :cellphone, String, desc: "cellphone del usuario"
  param :phone, String, desc: "phone del usuario"
  param :cost_center, String, desc: "cost_center del usuario"
  param :roleName, String, desc: "Nombre de los roles del usuario (Administrador, Contact Center, Technical Management, Field Service, Técnico)"
  param :worktime, String, desc: "worktime del usuario  (Full Time, Part Time)"
  param :country, String, desc: "Paises del usuario con su ISO separado por comas (CL,MX)"
  param :disabled, String, desc: "Indica si un usuario puede usar los servicios"
  example "Request: " + Rails.application.config.site_url + "/api/v1/users/1\n
	Salida:
	{
		id: 1,
		firstname: 'TESTF Updated',
		lastname: 'TESTL',
		created_at: '20/11/2020 11:26:05',
		updated_at: '20/11/2020 11:26:05',
		email: 'TESTF@TEST.TEST',
		surname: 'TESTS',
		cellphone: '(+56) 23423424 ',
		phone: '(+56) 23434234 ',
		cost_center: 'test1',
		role_id: 'CODE2',
		worktime: 'Full-Time',
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
		fullname: 'TESTF Updated TESTL TESTS'
	}
	"
  def update
    new_user_params = user_params
    new_user_params = user_params.except(:password) if user_params[:password].blank?

    if @user.update(new_user_params)
      @user.update(disabled: params[:disabled]) if params[:disabled]
      bypass_sign_in(@user) if current_user && (current_user.try(:id) == @user.try(:id))
      render json: @user.to_json
    else
      render json: @user.errors.full_messages, status: :bad_request
    end
  end

  api :DELETE, "/v1/users/:id", "ELIMINA un usuario en Tickets"
  param :ID, String, desc: "ID del usuario"
  example "Request: " + Rails.application.config.site_url + "/api/v1/users/1\n
	Salida:
		{ user_id: 1, message: 'User deleted!' }
	"
  def destroy
    user_id = @user.id
    @user&.destroy
    render json: {user_id: user_id, message: "User deleted!"}.to_json
  end

  api :POST, "/v1/users/:id/to_disable", "DESHABILITA o HABILITA un usuario en Tickets"
  param :ID, String, desc: "ID del usuario"
  example "Request: " + Rails.application.config.site_url + "/api/v1/users/1/to_disable\n
	Salida:
		{ user_id: 1, message: 'User disabled!' }
	"
  def to_disable
    user_id = @user.id
    @user.update(disabled: !@user.disabled)
    render json: @user.to_json
  end

  api :GET, "/v1/user_unique_ids", "Retorna los ID de usuarios desde el CORE"
  example "Request: " + Rails.application.config.site_url + "/api/v1/user_unique_ids\n
	Salida:
	{
	  data: [
			{
				id: 1,
				uniqueId: 'CODE1',
				name: 'NAME1',
				lastname: 'APP1',
				platform: 'Tickets',
				created_at: '2020-09-04T00:52:20.841Z',
				updated_at: '2020-09-04T00:52:20.841Z',
				classification: 'CLASS1',
				fullname: 'CODE1 - NAME1 APP1'
			},
			{
				id: 2,
				uniqueId: 'CODE2',
				name: 'NAME2',
				lastname: 'APP2',
				platform: 'Tickets',
				created_at: '2020-09-04T00:52:20.853Z',
				updated_at: '2020-09-04T00:52:20.853Z',
				classification: 'CLASS2',
				fullname: 'CODE2 - NAME2 APP2'
			},
			{
				id: 3,
				uniqueId: 'CODE3',
				name: 'NAME3',
				lastname: 'APP3',
				platform: 'Tickets',
				created_at: '2020-09-04T00:52:36.439Z',
				updated_at: '2020-09-04T00:52:36.439Z',
				classification: 'CLASS3',
				fullname: 'CODE3 - NAME3 APP3'
			}
		]
	}
	"
  def user_unique_ids
    response = {}
    response = ApiSingleton.user_unique_ids_api
    render json: response.to_json
  end
  api :GET, "/v1/cost_centers", "Retorna los centro de costos desde el CORE"
  example "Request: " + Rails.application.config.site_url + "/api/v1/cost_centers\n
	Salida:
	{
		data: [
			{
				id: 1,
				code: 'test1',
				name: 'test1',
				created_at: '2020-09-03T22:57:20.566Z',
				updated_at: '2020-09-03T22:57:20.566Z',
				fullname: 'test1 - test1'
			},
			{
				id: 2,
				code: 'test2',
				name: 'test2',
				created_at: '2020-09-03T22:57:20.577Z',
				updated_at: '2020-09-03T22:57:20.577Z',
				fullname: 'test2 - test2'
			},
			{...}
		]
	}
	"
  def	cost_centers
    response = {}
    response = ApiSingleton.cost_centers_api
    render json: response.to_json
  end

  api :GET, "/v1/users/:id/notifications", "Retorna las notificaciones de un usuario mediante su ID"
  param :id, String, desc: "ID del usuario consultado"
  example "Request: " + Rails.application.config.site_url + "/api/v1/users/1\n
	Salida:
	{
		data: {
			id: 1,
			firstname: 'TESTF',
			lastname: 'TESTL',
			created_at: '20/11/2020 11:26:05',
			updated_at: '20/11/2020 11:26:05',
			email: 'TESTF@TEST.TEST',
			surname: 'TESTS',
			cellphone: '(+56) 23423424 ',
			phone: '(+56) 23434234 ',
			cost_center: 'test1',
			role_id: 'CODE2',
			worktime: 'Full-Time',
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
		}
	}
	"
  def notifications
    response = {}
    response["page"] = params[:page].blank? ? 1 : params[:page].to_i
    response["per_page"] = params[:per_page].blank? ? 10 : params[:per_page].to_i

    notifications = @user.notifications.newest_first
    notifications = notifications.search(params[:keywords]) unless params[:keywords].blank?

    unless params[:filter_value].blank?
      if params[:filter_value] == "Leídos"
        notifications = notifications.read
      elsif params[:filter_value] ==	"No leídos"
        notifications = notifications.unread
      end
    end

    notifications = begin
      notifications.paginate(page: params[:page], per_page: params[:per_page])
    rescue
      []
    end
    response["data"] = (notifications.nil? ? [] : notifications)
    response["total"] = begin
      notifications.total_entries
    rescue
      0
    end
    render json: response.to_json(include: [:recipient], methods: [:read, :unread, :days])
  end

  api :GET, "/v1/users/:id/notifications/:notification_id/read", "Marca una notificacion como leída"
  param :id, String, desc: "ID del usuario consultado"
  param :notification_id, String, desc: "ID de la notificación"
  example "Request: " + Rails.application.config.site_url + "/api/v1/users/1/notifications/1/read\n
	Salida:
	{
		data: {
			id: 1,
			firstname: 'TESTF',
			lastname: 'TESTL',
			created_at: '20/11/2020 11:26:05',
			updated_at: '20/11/2020 11:26:05',
			email: 'TESTF@TEST.TEST',
			surname: 'TESTS',
			cellphone: '(+56) 23423424 ',
			phone: '(+56) 23434234 ',
			cost_center: 'test1',
			role_id: 'CODE2',
			worktime: 'Full-Time',
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
		}
	}
	"
  def notification_read
    notification = @user.notifications.find_by_id(params[:notification_id])
    notification.mark_as_read! if notification
    render json: notification.to_json(include: [:recipient], methods: [:read, :unread, :days])
  end

  api :GET, "/v1/users/:id/notifications_unread", "Retorna las notificaciones no leidas de un usuario mediante su ID"
  param :id, String, desc: "ID del usuario consultado"
  example "Request: " + Rails.application.config.site_url + "/api/v1/users/1\n
	Salida:
	{
		data: {
			id: 1,
			firstname: 'TESTF',
			lastname: 'TESTL',
			created_at: '20/11/2020 11:26:05',
			updated_at: '20/11/2020 11:26:05',
			email: 'TESTF@TEST.TEST',
			surname: 'TESTS',
			cellphone: '(+56) 23423424 ',
			phone: '(+56) 23434234 ',
			cost_center: 'test1',
			role_id: 'CODE2',
			worktime: 'Full-Time',
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
		}
	}
	"
    def notifications_unread
  	    response = {}
    
      from = Time.zone.now - 1.month
      to = Time.zone.now
      notifications = @user.notifications.newest_first.where(created_at: from..to).unread
  	    response["data"] = (notifications.nil? ? [] : notifications)
	    render json: response.to_json
	end

private

  def set_user
	@user = User.find_by(id: params[:id])
  end
  
  def user_params
    params.permit(:id, :firstname, :lastname, :email, :password, :surname, :cellphone, :phone, :cost_center, :role_id, :worktime)
  end

  def save_roles
    if params[:roleName]
      new_roles = params[:roleName].split(",")
      @user.roles.destroy_all
      new_roles.each do |role|
        new_role = Role.find_by(name: role)
        unless new_role.nil?
          @user.roles << new_role
        end
      end
    end
  end

  def send_welcome_email
    return if @user.email.blank?

    DeviseMailer.welcome_email(@user).deliver_now if !@user.customer?
  end

  def save_countries
    if params[:country]
      new_countries = params[:country].split(",")
      @user.countries.destroy_all
      new_countries.each do |country|
        new_country = Country.find_by(iso: country)
        unless new_country.nil?
          @user.countries << new_country
        end
      end
    end
  end
end

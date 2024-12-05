class Api::V1::CustomersController < ApplicationController
    protect_from_forgery with: :null_session, except: [:mock_customer]
    skip_before_action :authenticate_user!
    include ActionController::HttpAuthentication::Token::ControllerMethods
    before_action :authenticate, except: [:mock_customer]
    after_action :send_payment_email, only: [:create_service]
     
    skip_before_action :verify_authenticity_token, only: [:mock_customer]

    api :GET, "/v1/project_customers", "Retorna los clientes del core filtrados por la plataforma 'Tickets' y paginados"
    param :page, String, :desc => "Pagina consultada 1..n"
    param :per_page, String, :desc => "Resultados por paǵina esperados"
    param :keywords, String, :desc => "Filtro de texto para encontrar al cliente"
    param :country, String, :desc => "Códigos de paises separados por , si es mas de uno (MX,CL)"
    example "Request: "+Rails.application.config.site_url+"/api/v1/customers?page=2\n
	Salida:
        {
            page: 2,
            per_page: 10,
            data: [
                {... cliente},
                {... cliente},
                {... cliente},
                {... cliente},
                {... cliente},
                {... cliente},
                {... cliente},
                {... cliente},
                {... cliente},
                {... cliente}
            ],
            total: 48
        }
	"
    def project_customers_index
        page = (params[:page].blank? ? 1 : params[:page])
        per_page = (params[:per_page].blank? ? 10 : params[:per_page])
        keywords = (params[:keywords].blank? ? "" : params[:keywords])
        countries_iso = current_user.countries.pluck(:iso).join(",")
        country = (params[:country].blank? ? countries_iso : params[:country])
        render json:  ApiSingleton.project_customers_api(page, per_page, keywords, country)
    end


    api :GET, "/v1/customers", "Retorna los clientes del core filtrados por la plataforma 'Tickets' y paginados"
    param :page, String, :desc => "Pagina consultada 1..n"
    param :per_page, String, :desc => "Resultados por paǵina esperados"
    param :keywords, String, :desc => "Filtro de texto para encontrar al cliente"
    param :country, String, :desc => "Códigos de paises separados por , si es mas de uno (MX,CL)"
    example "Request: "+Rails.application.config.site_url+"/api/v1/customers?page=2\n
	Salida:
        {
            page: 2,
            per_page: 10,
            data: [
                {... cliente},
                {... cliente},
                {... cliente},
                {... cliente},
                {... cliente},
                {... cliente},
                {... cliente},
                {... cliente},
                {... cliente},
                {... cliente}
            ],
            total: 48
        }
	"
    def index
        page = (params[:page].blank? ? 1 : params[:page])
        per_page = (params[:per_page].blank? ? 10 : params[:per_page])
        keywords = (params[:keywords].blank? ? "" : params[:keywords])
        countries_iso = current_user.countries.pluck(:iso).join(",")
        country = (params[:country].blank? ? countries_iso : params[:country])
        render json:  ApiSingleton.customers_api(page, per_page, keywords, country)
	end

    api :POST, "/v1/customers", "Crea un cliente para la plataforma 'Tickets' en Miele Core"
    param :names, String, :desc => "names del cliente"
    param :lastname, String, :desc => "lastname del cliente"
    param :surname, String, :desc => "surname del cliente"
    param :email, String, :desc => "email del cliente"
    param :zipcode, String, :desc => "zipcode del cliente"
    param :state, String, :desc => "state del cliente"
    param :delegation, String, :desc => "delegation del cliente"
    param :colony, String, :desc => "colony del cliente"
    param :street_type, String, :desc => "street_type del cliente"
    param :street_name, String, :desc => "street_name del cliente"
    param :ext_number, String, :desc => "ext_number del cliente"
    param :int_number, String, :desc => "int_number del cliente"
    param :phone, String, :desc => "phone del cliente"
    param :cellphone, String, :desc => "cellphone del cliente"
    param :reference, String, :desc => "reference del cliente"
    param :business_name, String, :desc => "business_name del cliente"
    param :rfc, String, :desc => "rfc del cliente"
    param :email_fn, String, :desc => "email de facturación del cliente"
    param :zipcode_fn, String, :desc => "zipcode de facturación del cliente"
    param :state_fn, String, :desc => "state de facturación del cliente"
    param :delegation_fn, String, :desc => "delegation de facturación del cliente"
    param :colony_fn, String, :desc => "colony de facturación del cliente"
    param :street_type_fn, String, :desc => "street_type de facturación del cliente"
    param :street_name_fn, String, :desc => "street_name de facturación del cliente"
    param :ext_number_fn, String, :desc => "ext_number de facturación del cliente"
    param :int_number_fn, String, :desc => "int_number de facturación del cliente"
    param :phone_fn, String, :desc => "phone de facturación del cliente"
    param :person_type, String, :desc => "person_type del cliente"
    param :country, String, :desc => "country del cliente"
    param :rut, String, :desc => "rut del cliente"
    param :email2, String, :desc => "email2 del cliente"
    param :commercial_business, String, :desc => "commercial_business del cliente"
    param :tradename, String, :desc => "tradename del cliente"
    param :customer_id, String, :desc => "customer_id del cliente"
    example "Request: "+Rails.application.config.site_url+"/api/v1/customers\n
	Salida:
        {
            id: 1,
            names: 'Test names',
            lastname: 'Test lastname',
            surname: 'Test surname',
            email: 'test.email.com',
            zipcode: 'testzipcode',
            state: '01',
            delegation: 'Test delegation',
            colony: 'Test colony',
            street_type: 'Av.',
            street_name: 'Test street name',
            ext_number: '12345',
            int_number: '12345',
            phone: '(+56) 1234567',
            cellphone: '(+52) 12345678 ',
            reference: 'TEST',
            business_name: 'TEST enterprise',
            rfc: 'TEST RFC',
            email_fn: 'test.email.com',
            zipcode_fn: 'testzipcode',
            state_fn: '01',
            delegation_fn: 'Test delegation',
            colony_fn: 'Test colony',
            street_type_fn: 'Av.',
            street_name_fn: 'Test street name',
            ext_number_fn: '12345',
            int_number_fn: '12345',
            phone_fn: '(+56) 12345678',
            created_at: '27/10/2020 21:15:14',
            updated_at: '27/10/2020 21:15:14',
            person_type: 'person_p',
            rut: 'test rut',
            email2: 'testopt.email.com',
            commercial_business: 'TEST enterprise',
            country_id: 1,
            tradename: '',
            administrative_demarcation_id: '01',
            administrative_demarcation_fn_id: 01,
            country: {},
            additionals: [{...}],
            additional_addresses: [{...}],
            administrative_demarcation: {...},
            administrative_demarcation_fn: {...},
            customer_products: [{...}],
            policies: [{...}],
            last_service: {...}
        }
	"
    def create
        if customer_project_params[:selected_customer].nil?
            @user = User.find_by(email: customer_params[:email])
            unless @user.nil?
                render json: ["Email ya en uso por usuario"], status: :bad_request
                return
            end
            @customer =  ApiSingleton.create_customer_api(customer_params)
            if (@customer["id"] rescue false)
                user_params_t = {
                    firstname: (customer_params[:names].blank? ? "Sin Información" : customer_params[:names]),
                    lastname: (customer_params[:lastname].blank? ? "Sin Información" : customer_params[:lastname]),
                    surname: (customer_params[:surname].blank? ? "Sin Información" : customer_params[:surname]),
                    email: customer_params[:email],
                    password: "mielePartner",
                    cellphone: customer_params[:cellphone],
                    phone: customer_params[:phone],
                    customer_id: @customer["id"]
                }
                user = User.create(user_params_t)
                unless user.nil?
                    country = Country.find_by(iso: customer_params[:country])
                    unless country.nil?
                        user.countries << country
                    end
                    user.roles << Role.find_or_create_by(name: "Cliente")
                end
                render json: @customer.to_json
            else
                render json: @customer, status: :bad_request
            end
        else
            @project_customer = ApiSingleton.get_project_customer_api(customer_project_params[:rfc_project])
            unless @project_customer["project_customer"].nil?
                render json: ["el rut de empresa ya se encuentra en uso"], status: :bad_request
                return
            else
            @project = ApiSingleton.create_project_customer_api(customer_project_params)
            
            end
            
        end
       
    end

    api :POST, "/v1/customersAdditional", "Crea un cliente adicional a otro para la plataforma 'Tickets' en Miele Core"
    param :customer_id, String, :desc => "ID del cliente para agregar adicional"
    param :names, String, :desc => "names del cliente adicional"
    param :lastname, String, :desc => "lastname del cliente adicional"
    param :surname, String, :desc => "surname del cliente adicional"
    param :email, String, :desc => "email del cliente adicional"
    param :phone, String, :desc => "phone del cliente adicional"
    param :cellphone, String, :desc => "cellphone del cliente adicional"
    param :customer, String, :desc => "customer del cliente adicional"
    example "Request: "+Rails.application.config.site_url+"/api/v1/customersAdditional\n
	Salida:
        {
            id: 1,
            customer_id: 1,
            names: 'TEST',
            lastname: 'TEST',
            surname: 'TEST',
            email: 'TEST@EMAIL.COM',
            phone: '(+52) 1231231231',
            cellphone: '(+52) 123123123 ',
            created_at: '2020-11-23T15:50:35.330Z',
            updated_at: '2020-11-23T15:50:35.330Z'
        }
	"
    def createAdditional
        @additional =  ApiSingleton.create_customer_additional_api(customer_params)
        if (@additional["id"] rescue false)
            render json: @additional.to_json
        else
            render json: @additional, status: :bad_request
        end
    end

    api :PATCH, "/v1/customersAdditional/:id", "Crea un cliente adicional a otro para la plataforma 'Tickets' en Miele Core"
    param :id, String, :desc => "ID del cliente adicional a actualizar"
    param :customer_id, String, :desc => "ID del cliente para actualizar adicional"
    param :names, String, :desc => "names del cliente adicional"
    param :lastname, String, :desc => "lastname del cliente adicional"
    param :surname, String, :desc => "surname del cliente adicional"
    param :email, String, :desc => "email del cliente adicional"
    param :phone, String, :desc => "phone del cliente adicional"
    param :cellphone, String, :desc => "cellphone del cliente adicional"
    param :customer, String, :desc => "customer del cliente adicional"
    example "Request: "+Rails.application.config.site_url+"/api/v1/customersAdditional/1\n
	Salida:
        {
            id: 1,
            customer_id: 1,
            names: 'TEST UPDATED',
            lastname: 'TEST UPDATED',
            surname: 'TEST UPDATED',
            email: 'TESTUPDATED@EMAIL.COM',
            phone: '(+52) 1231231231',
            cellphone: '(+52) 123123123 ',
            created_at: '2020-11-23T15:50:35.330Z',
            updated_at: '2020-11-23T15:50:35.330Z'
        }
	"
    def updateAdditional
        @additional =  ApiSingleton.update_customer_additional_api(params[:id],customer_params)
        if (@additional["id"] rescue false)
            render json: @additional.to_json
        else
            render json: @additional, status: :bad_request
        end
    end
=begin   
    def destroyAdditional
        @additional =  ApiSingleton.destroy_customer_additional_api(params[:id])
        if (@additional["id"] rescue false)
            render json: @additional.to_json
        else
            render json: @additional, status: :bad_request
        end
    end
=end
    api :POST, "/v1/customersAdditionalAddress", "Crea una dirección adicional a un cliente en 'Tickets' en Miele Core"
    param :id, String, :desc => "ID de la dirección adicional"
    param :customer_id, String, :desc => "ID del cliente para agregar adicional"
    param :name, String, :desc => "name de la direccion adicional a agregar"
    param :zipcode, String, :desc => "zipcode de la direccion adicional a agregar"
    param :state, String, :desc => "state de la direccion adicional a agregar"
    param :delegation, String, :desc => "delegation de la direccion adicional a agregar"
    param :colony, String, :desc => "colony de la direccion adicional a agregar"
    param :street_type, String, :desc => "street_type de la direccion adicional a agregar"
    param :street_name, String, :desc => "street_name de la direccion adicional a agregar"
    param :ext_number, String, :desc => "ext_number de la direccion adicional a agregar"
    param :int_number, String, :desc => "int_number de la direccion adicional a agregar"
    param :country_id, String, :desc => "ISO del país de la direccion adicional a agregar"
    example "Request: "+Rails.application.config.site_url+"/api/v1/customersAdditionalAddress\n
	Salida:
        {
            id: 1,
            name: 'TEST ADDICIONAL',
            zipcode: 'test zipcode',
            state: '01',
            delegation: 'Test delegation',
            colony: 'Test colony',
            street_name: 'TEST ADDICIONAL CALLE',
            street_type: 'Pasaje',
            ext_number: '12345',
            int_number: '12345',
            country_id: 2,
            administrative_demarcation_id: 1,
            customer_id: 1,
            created_at: '2020-11-02T15:37:52.781Z',
            updated_at: '2020-11-02T15:37:52.781Z',
            country: {
                id: 2,
                name: 'Chile',
                iso: 'CL',
                created_at: '2020-09-02T20:07:18.167Z',
                updated_at: '2020-09-02T20:07:18.167Z'
            }
        }
	"
    def createAdditionalAddress
        @additional_address =  ApiSingleton.create_customer_additional_address_api(additional_address_params)
        if (@additional_address["id"] rescue false)
            render json: @additional_address.to_json
        else
            render json: @additional_address, status: :bad_request
        end
    end

    api :PATCH, "/v1/customersAdditionalAddress/:id", "ACTUALIZA una dirección adicional a un cliente en 'Tickets' en Miele Core"
    param :customer_id, String, :desc => "ID del cliente para actualizar adicional"
    param :name, String, :desc => "name de la direccion adicional a actualizar"
    param :zipcode, String, :desc => "zipcode de la direccion adicional a actualizar"
    param :state, String, :desc => "state de la direccion adicional a actualizar"
    param :delegation, String, :desc => "delegation de la direccion adicional a actualizar"
    param :colony, String, :desc => "colony de la direccion adicional a actualizar"
    param :street_type, String, :desc => "street_type de la direccion adicional a actualizar"
    param :street_name, String, :desc => "street_name de la direccion adicional a actualizar"
    param :ext_number, String, :desc => "ext_number de la direccion adicional a actualizar"
    param :int_number, String, :desc => "int_number de la direccion adicional a actualizar"
    param :country_id, String, :desc => "ISO del país de la direccion adicional a actualizar"
    example "Request: "+Rails.application.config.site_url+"/api/v1/customersAdditionalAddress/1\n
	Salida:
        {
            id: 1,
            name: 'TEST UPDATED ADDICIONAL',
            zipcode: 'test zipcode',
            state: '01',
            delegation: 'Test delegation',
            colony: 'Test colony',
            street_name: 'TEST UPDATED ADDICIONAL CALLE',
            street_type: 'Pasaje',
            ext_number: '12345',
            int_number: '12345',
            country_id: 2,
            administrative_demarcation_id: 1,
            customer_id: 1,
            created_at: '2020-11-02T15:37:52.781Z',
            updated_at: '2020-11-02T15:37:52.781Z',
            country: {
                id: 2,
                name: 'Chile',
                iso: 'CL',
                created_at: '2020-09-02T20:07:18.167Z',
                updated_at: '2020-09-02T20:07:18.167Z'
            }
        }
	"
    def updateAdditionalAddress
        @additional_address =  ApiSingleton.update_customer_additional_address_api(params[:id],additional_address_params)
        if (@additional_address["id"] rescue false)
            render json: @additional_address.to_json
        else
            render json: @additional_address, status: :bad_request
        end
    end

    api :DELETE, "/v1/customersAdditionalAddress/:id", "Elimina la dirección adicional de un cliente filtrados por la plataforma 'Tickets'"
    param :id, String, :desc => "ID de la dirección adicional a eliminar"
    example "Request: "+Rails.application.config.site_url+"/api/v1/customersAdditionalAddress/1\n
        Salida:
            {
                additional_address_id: 1
            }
        Devuelve el id de la dirección adicional eliminada, para poder filtrarlo de ser necesario.
    "
    def destroyAdditionalAddress
        @additional_address =  ApiSingleton.destroy_customer_additional_address_api(params[:id])
        if (@additional_address["additional_address_id"] rescue false)
            render json: @additional_address.to_json
        else
            render json: @additional_address, status: :bad_request
        end
    end

    api :GET, "/v1/customers/:id", "Retorna la información de un cliente filtrados por la plataforma 'Tickets' y id"
    param :id, String, :desc => "ID el cliente a consultar"
    param :email, String, :desc => "Email del cliente (opcional), si es que no se conoce el ID y enviar no_id. '/api/v1/customers/no_id?email=test.email.com'"
	example "Request: "+Rails.application.config.site_url+"/api/v1/customers\n
	Salida:
        {
            id: 1,
            names: 'Test names',
            lastname: 'Test lastname',
            surname: 'Test surname',
            email: 'test.email.com',
            zipcode: 'testzipcode',
            state: '01',
            delegation: 'Test delegation',
            colony: 'Test colony',
            street_type: 'Av.',
            street_name: 'Test street name',
            ext_number: '12345',
            int_number: '12345',
            phone: '(+56) 1234567',
            cellphone: '(+52) 12345678 ',
            reference: 'TEST',
            business_name: 'TEST enterprise',
            rfc: 'TEST RFC',
            email_fn: 'test.email.com',
            zipcode_fn: 'testzipcode',
            state_fn: '01',
            delegation_fn: 'Test delegation',
            colony_fn: 'Test colony',
            street_type_fn: 'Av.',
            street_name_fn: 'Test street name',
            ext_number_fn: '12345',
            int_number_fn: '12345',
            phone_fn: '(+56) 12345678',
            created_at: '27/10/2020 21:15:14',
            updated_at: '27/10/2020 21:15:14',
            person_type: 'person_p',
            rut: 'test rut',
            email2: 'testopt.email.com',
            commercial_business: 'TEST enterprise',
            country_id: 1,
            tradename: '',
            administrative_demarcation_id: '01',
            administrative_demarcation_fn_id: 01,
            country: {},
            additionals: [{...}],
            additional_addresses: [{...}],
            administrative_demarcation: {...},
            administrative_demarcation_fn: {...},
            customer_products: [{...}],
            policies: [{...}],
            last_service: {...}
        }
	"
  def show
    @customer = ApiSingleton.get_customer_api(params[:id], params[:email])

    if @customer.has_key?("error")
      render json: @customer, status: :bad_request
      return
    end

    technicians_ids = @customer["data"]["last_service"]["calendar_events"].collect{|calendar| calendar["object_id"]} rescue []
    technicians = Technician.where(id: technicians_ids)
    unless @customer["data"]["last_service"].nil?
      @customer["data"]["last_service"]["technicians"] = technicians
    end
    response = @customer
    render json: response.to_json
  end

    api :PATCH, "/v1/customers", "Actualiza un cliente para la plataforma 'Tickets' en Miele Core"
    param :id, String, :desc => "ID del cliente a actualizar"
    param :names, String, :desc => "names del cliente"
    param :lastname, String, :desc => "lastname del cliente"
    param :surname, String, :desc => "surname del cliente"
    param :email, String, :desc => "email del cliente"
    param :zipcode, String, :desc => "zipcode del cliente"
    param :state, String, :desc => "state del cliente"
    param :delegation, String, :desc => "delegation del cliente"
    param :colony, String, :desc => "colony del cliente"
    param :street_type, String, :desc => "street_type del cliente"
    param :street_name, String, :desc => "street_name del cliente"
    param :ext_number, String, :desc => "ext_number del cliente"
    param :int_number, String, :desc => "int_number del cliente"
    param :phone, String, :desc => "phone del cliente"
    param :cellphone, String, :desc => "cellphone del cliente"
    param :reference, String, :desc => "reference del cliente"
    param :business_name, String, :desc => "business_name del cliente"
    param :rfc, String, :desc => "rfc del cliente"
    param :email_fn, String, :desc => "email de facturación del cliente"
    param :zipcode_fn, String, :desc => "zipcode de facturación del cliente"
    param :state_fn, String, :desc => "state de facturación del cliente"
    param :delegation_fn, String, :desc => "delegation de facturación del cliente"
    param :colony_fn, String, :desc => "colony de facturación del cliente"
    param :street_type_fn, String, :desc => "street_type de facturación del cliente"
    param :street_name_fn, String, :desc => "street_name de facturación del cliente"
    param :ext_number_fn, String, :desc => "ext_number de facturación del cliente"
    param :int_number_fn, String, :desc => "int_number de facturación del cliente"
    param :phone_fn, String, :desc => "phone de facturación del cliente"
    param :person_type, String, :desc => "person_type del cliente"
    param :country, String, :desc => "country del cliente"
    param :rut, String, :desc => "rut del cliente"
    param :email2, String, :desc => "email2 del cliente"
    param :commercial_business, String, :desc => "commercial_business del cliente"
    param :tradename, String, :desc => "tradename del cliente"
    param :customer_id, String, :desc => "customer_id del cliente"
    example "Request: "+Rails.application.config.site_url+"/api/v1/customers\n
	Salida:
        {
            id: 1,
            names: 'Test names',
            lastname: 'Test lastname',
            surname: 'Test surname',
            email: 'test.email.com',
            zipcode: 'testzipcode',
            state: '01',
            delegation: 'Test delegation',
            colony: 'Test colony',
            street_type: 'Av.',
            street_name: 'Test street name',
            ext_number: '12345',
            int_number: '12345',
            phone: '(+56) 1234567',
            cellphone: '(+52) 12345678 ',
            reference: 'TEST',
            business_name: 'TEST enterprise',
            rfc: 'TEST RFC',
            email_fn: 'test.email.com',
            zipcode_fn: 'testzipcode',
            state_fn: '01',
            delegation_fn: 'Test delegation',
            colony_fn: 'Test colony',
            street_type_fn: 'Av.',
            street_name_fn: 'Test street name',
            ext_number_fn: '12345',
            int_number_fn: '12345',
            phone_fn: '(+56) 12345678',
            created_at: '27/10/2020 21:15:14',
            updated_at: '27/10/2020 21:15:14',
            person_type: 'person_p',
            rut: 'test rut',
            email2: 'testopt.email.com',
            commercial_business: 'TEST enterprise',
            country_id: 1,
            tradename: '',
            administrative_demarcation_id: '01',
            administrative_demarcation_fn_id: 01,
            country: {},
            additionals: [{...}],
            additional_addresses: [{...}],
            administrative_demarcation: {...},
            administrative_demarcation_fn: {...},
            customer_products: [{...}],
            policies: [{...}],
            last_service: {...}
        }
	"
    def update
        @user = User.find_by(email: customer_params[:email])
        @customer = ApiSingleton.get_customer_api(params[:id])

        if !@user.nil? && (@customer["data"]["email"].downcase != customer_params[:email].downcase)
            render json: ["Email ya en uso por usuario"], status: :bad_request
            return
        end
        @customer =  ApiSingleton.update_customer_api(params[:id],customer_params)
        if (@customer["id"] rescue false)
            user_params_t = {
                firstname: (customer_params[:names].blank? ? "Sin Información" : customer_params[:names]),
                lastname: (customer_params[:lastname].blank? ? "Sin Información" : customer_params[:lastname]),
                surname: (customer_params[:surname].blank? ? "Sin Información" : customer_params[:surname]),
                email: customer_params[:email],
                #password: "mielePartner",
                cellphone: customer_params[:cellphone],
                phone: customer_params[:phone],
                customer_id: @customer["id"]
            }
            unless @user.nil?
                @user.update(user_params_t)
                user =  @user.reload
            else
                user = User.create(user_params_t)
                unless user.nil?
                    country = Country.find_by(iso: customer_params[:country])
                    unless country.nil?
                        user.countries << country
                    end
                    user.roles << Role.find_or_create_by(name: "Cliente")
                end
            end
            render json: @customer.to_json
        else
            render json: @customer, status: :bad_request
        end
    end

    def mock_customer
        render json: {"id" => "34"}, layout: false
    end

    def mock_policy
        render json: {"id" => "34", "customer_id" => "34", "customer" => {"email" => "34@email.com"}}, layout: false
    end

    api :GET, "/v1/customers/:id/products", "Productos de un cliente en Miele Core"
    param :id, String, :desc => "ID del cliente"
    example "Request: "+Rails.application.config.site_url+"/api/v1/customers/1/products\n
	Salida:
    [
        {
            id: 1,
            customer_id: 1,
            product_id: 1,
            created_at: '2020-10-29T13:22:43.886Z',
            updated_at: '2020-10-29T13:22:43.886Z',
            status: 'Inicial',
            warranty: '1/1/1990',
            policy: 'S/N',
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
        },
        {...}
    ]
    "
    def products
        @products = ApiSingleton.get_customer_products_api(params[:id])
        response = @products
        render json: response.to_json
    end

    api :POST, "/v1/customers/:customer_id/create_product", "Asigna un producto a un cliente en Miele Core"
    param :customer_id, String, :desc => "ID del cliente a asignar productos" 
    param :products, String, :desc => "Array de ids de usuario"
    param :dispatchgroup_id, String, :desc => "Número de envío del producto" 
	param :quotation_id, String, :desc => "Número de orden del producto" 
    example "Request: "+Rails.application.config.site_url+"/api/v1/customers/1/create_product\n
	Salida:
    {
        id: 1,
        customer_id: 1,
        product_id: 1,
        created_at: '2020-10-29T13:22:43.886Z',
        updated_at: '2020-10-29T13:22:43.886Z',
        status: 'Inicial',
        warranty: '1/1/1990',
        policy: 'S/N',
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
    def create_product
        @customer_products = ApiSingleton.get_create_customer_products_api(customer_product_params)
        if (@customer_products.any? and @customer_products[0]['id'] rescue false)
            render json: @customer_products.to_json
        else
            render json: @customer_products, status: :bad_request
        end
    end

    api :POST, "/v1/customers/get_quotations", "Obtiene todas las cotizaciones de un cliente"
    param :email, String, :desc => "email del cliente" 
    example "Request: "+Rails.application.config.site_url+"/api/v1/customers/1/get_quotations\n
	Salida:
    {
        
    }
    "
    def get_quotations
        @quotations = MieleB2bApi.get_customer_quotations({email: params["email"]})
        if (@quotations.any? rescue false)
            render json: @quotations.to_json
        else
            render json: @quotations, status: :bad_request
        end
    end

    api :PATCH, "/v1/customers/:customer_id/update_product", "Actualiza un product  a un cliente en Miele Core"
    param :customer_id, String, :desc => "ID del cliente a asignar productos" 
	param :customer_product_id, String, :desc => "ID del producto del cliente"
	param :id, String, :desc => "ID de serie del producto del cliente"
	param :tnr, String, :desc => "TRN del producto"
    param :business_unit, String, :desc => "business_unit del producto"
    param :family, String, :desc => "family del producto"
    param :subfamily, String, :desc => "subfamily del producto"
    param :specific, String, :desc => "specific del producto"
    param :product_name, String, :desc => "product_name del producto" 
	param :technical_diagnosis, String, :desc => "technical_diagnosis del producto", allow_nil: true
	param :expert_opinion, String, :desc => "expert_opinion del producto", allow_nil: true
	param :activity_performed, String, :desc => "activity_performed del producto", allow_nil: true
	param :warranty, String, :desc => "warranty del producto"
	param :status, String, :desc => "status del producto"
    param :visit_id, String, :desc => "ID de la visita"
    param :dispatchgroup_id, String, :desc => "Número de envío del producto" 
	param :quotation_id, String, :desc => "Número de orden del producto" 
    param :images, Array, :desc => "Array de imagenes a asociar images:[{uri: [path de la imagen], mime: [formato], uri_64: [imagen en base 64], filename: [nombre imagen}, description: {descripción de la imagen}]"
    param :unit_real_state_id, String, desc: 'ID de la unidad inmoviliara seleccionada desde la app técnicos'
    param :unit_real_state_number, String, desc: 'Número de la unidad inmoviliaria actualizada desde la app de técnicos'
	example "Request: "+Rails.application.config.site_url+"/api/v1/customers/1/update_product\n
	Salida:
    {
        id: 1,
        customer_id: 1,
        product_id: 1,
        created_at: '2020-10-29T13:22:43.886Z',
        updated_at: '2020-10-29T13:22:43.886Z',
        status: 'Inicial',
        warranty: '1/1/1990',
		policy: 'S/N',
		technical_diagnosis: '',
		expert_opinion: '',
		activity_performed: '',
		product: {
            id: 1,
            country_id: 1,
            platform: 'Tickets',
            tnr: 'test_tnr',
            ean: 'test_ean',
            profit_center: '123',
            name: 'Aspiradora test updated',
            description: 'Aspirador test updated desc.',
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
    def update_product
        @customer_product = ApiSingleton.get_update_customer_products_api(customer_product_update_params, params)
        if (@customer_product["id"] rescue false)
            render json: @customer_product.to_json
        else
            render json: @customer_product, status: :bad_request
        end
    end 

    api :POST, "/v1/customers/:customer_id/create_product_additional", "Asigna un productov inexistente a un cliente en Miele Core"
    param :customer_id, String, :desc => "ID del cliente a asignar productos" 
    param :business_unit, String, :desc => "business_unit del producto inexistente"
    param :family, String, :desc => "family del producto inexistente"
    param :subfamily, String, :desc => "subfamily del producto inexistente"
    param :product_name, String, :desc => "product_name del producto inexistente"
    #param :quantity, String, :desc => "Cantidad del producto, es 1 si no se ingresa"
    
    example "Request: "+Rails.application.config.site_url+"/api/v1/customers/1/create_product_additional\n
	Salida:
    {
        id: 1,
        customer_id: 1,
        product_id: 1,
        created_at: '2020-10-29T13:22:43.886Z',
        updated_at: '2020-10-29T13:22:43.886Z',
        status: 'Inicial',
        warranty: '1/1/1990',
        policy: 'S/N',
        product: {
            id: 1,
            country_id: 1,
            platform: 'Tickets',
            tnr: 'test_tnr',
            ean: 'test_ean',
            profit_center: '123',
            name: 'Additional Aspiradora test',
            description: 'Additional Aspirador test desc.',
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
    def create_product_additional
        @customer_product = ApiSingleton.get_create_customer_products_additional_api(customer_product_additional_params)
        if (@customer_product["id"] rescue false)
            render json: @customer_product.to_json
        else
            render json: @customer_product, status: :bad_request
        end
    end 

    
    api :DELETE, 'customers/:customer_id/customer_product/:customer_product_id', "Elimina un producto a un cliente en Miele Core"
    param :customer_id, String, :desc => "ID del cliente a eliminar el producto" 
    param :customer_product_id, String, :desc => "ID del producto del cliente, que se quiere eliminar"
    example "Request: "+Rails.application.config.site_url+"/api/v1/customers/1/customer_product/1\n
	Salida:
        { customer_product_id: 1, message: 'Producto de cliente eliminado' }
    "
    def delete_product
        @customer_product =  ApiSingleton.destroy_customer_customer_product_api(params[:customer_id],params[:customer_product_id])
        if (@customer_product["customer_product_id"] rescue false)
            render json: @customer_product.to_json
        else
            render json: @customer_product, status: :bad_request
        end
    end 
    ########################
	### Customer Policies
	########################


	api :POST, "/v1/customers/:customer_id/create_policy", "Asigna una póliza a un cliente en Miele Core"
	param :customer_id, String, :desc => "ID del cliente a asignar póliza" 
	param :customer_products_id, String, :desc => "Array de ids de producos del usuario separados por coma (1,2,3)" 
	param :address_assinged, String, :desc => "Referencia a la dirección del cliente asignada. Usar 'principal' si es la dirección principal o el id de la adicional." 
	param :labor_price, String, :desc => "Precio de la mano de obra" 
	param :items_price, String, :desc => "Precio de los consumibles" 
	param :viatic_price, String, :desc => "Precio de los viáticos" 
    param :iva_amount, String, :desc => "Monto en IVA" 
    param :subtotal_price, String, :desc => "Subtotal sin IVA"
    param :total_price, String, :desc => "Total del monto de la póliza"
    example "Request: "+Rails.application.config.site_url+"/api/v1/customers/1/create_policy\n
	Salida:
    {
        id: 1,
        customer_id: 1,
        address_assinged: 'principal',
        labor_price: 3000,
        items_price: 0,
        viatic_price: 0,
        total_price: 3000,
        created_at: '2020-11-11T18:42:04.824Z',
        updated_at: '2020-11-11T18:42:04.824Z',
        customer_products: [{...}],
        policy_customer_products: [{...}]
    }
    "
	def create_policy
		@customer_policy = ApiSingleton.get_create_customer_policy_api(customer_policy_params)
        if (@customer_policy["id"] rescue false)
            NotificationMailer.policy_email(@customer_policy["customer"]["email"], params[:customer_id], @customer_policy["id"]).deliver_now
            render json: @customer_policy.to_json
        else
            render json: @customer_policy, status: :bad_request
        end
    end
    
    api :PATCH, "/v1/customers/:customer_id/policies/:policy_id/update_policy", "Actualiza una póliza de un cliente en Miele Core"
	param :customer_id, String, :desc => "ID del cliente a asignar póliza" 
	param :policy_id, String, :desc => "ID de la póliza" 
	param :customer_products_id, String, :desc => "Array de ids de producos del usuario separados por coma (1,2,3)" 
	param :address_assinged, String, :desc => "Referencia a la dirección del cliente asignada. Usar 'principal' si es la dirección principal o el id de la adicional." 
	param :labor_price, String, :desc => "Precio de la mano de obra" 
	param :items_price, String, :desc => "Precio de los consumibles" 
	param :viatic_price, String, :desc => "Precio de los viáticos" 
    param :iva_amount, String, :desc => "Monto en IVA" 
    param :subtotal_price, String, :desc => "Subtotal sin IVA"
    param :total_price, String, :desc => "Total del monto de la póliza"
    example "Request: "+Rails.application.config.site_url+"/api/v1/customers/1/policies/1/update_policy\n
	Salida:
    {
        id: 1,
        customer_id: 1,
        address_assinged: 'principal',
        labor_price: 4000,
        items_price: 0,
        viatic_price: 0,
        total_price: 4000,
        created_at: '2020-11-11T18:42:04.824Z',
        updated_at: '2020-11-11T18:42:04.824Z',
        customer_products: [{...}],
        policy_customer_products: [{...}]
    }
    "
    def update_policy
        @customer_policy = ApiSingleton.get_update_customer_policy_api(customer_policy_params)
        if (@customer_policy["id"] rescue false)
            render json: @customer_policy.to_json
        else
            render json: @customer_policy, status: :bad_request
        end
    end

    api :GET, "/v1/customers/:customer_id/policies/:policy_id", "Trae una póliza de un cliente en Miele Core"
	param :customer_id, String, :desc => "ID del cliente a asignar póliza" 
	param :policy_id, String, :desc => "ID de la póliza" 
	example "Request: "+Rails.application.config.site_url+"/api/v1/customers/1/policies/1\n
	Salida:
    {
        id: 1,
        customer_id: 1,
        address_assinged: 'principal',
        labor_price: 4000,
        items_price: 0,
        viatic_price: 0,
        total_price: 4000,
        created_at: '2020-11-11T18:42:04.824Z',
        updated_at: '2020-11-11T18:42:04.824Z',
        customer_products: [{...}],
        policy_customer_products: [{...}]
    }
    "
    def show_policy
        @customer_policy = ApiSingleton.get_customer_policy_api(customer_policy_params)
        if (@customer_policy["id"] rescue false)
            render json: @customer_policy.to_json
        else
            render json: @customer_policy, status: :bad_request
        end
    end

    api :DELETE, "v1/customers/:customer_id/policies/:policy_id", "Elimina una póliza de un cliente."
	param :customer_id, String, :desc => "ID del cliente a asignar póliza" 
	param :policy_id, String, :desc => "ID de la póliza" 
	example "Request: "+Rails.application.config.site_url+"/api/v1/customers/1/policies/1\n
	Salida:
    {
        id: 1,
        customer_id: 1,
        address_assinged: 'principal',
        labor_price: 3000,
        items_price: 0,
        viatic_price: 0,
        total_price: 3000,
        created_at: '2020-11-11T18:42:04.824Z',
        updated_at: '2020-11-11T18:42:04.824Z',
        customer_products: [{...}],
        policy_customer_products: [{...}]
    }
    "
	def destroy_policy
		@customer_policy = ApiSingleton.get_destroy_customer_policy_api(customer_policy_params)
        if (@customer_policy["policy_id"] rescue false)
            render json: @customer_policy.to_json
        else
            render json: @customer_policy, status: :bad_request
        end
    end


    
    api :POST, "/v1/customers/:customer_id/policies/:policy_id/validate_payment", "Valida un pago de una póliza asociada a un cliente."
	param :customer_id, String, :desc => "ID del cliente" 
	param :policy_id, String, :desc => "ID de la póliza"
    param :payment_files, Array, :desc => "Array de archivos asociados al pago payment_files:[{uri: [path de la imagen], mime: [formato], uri_64: [imagen en base 64], filename: [nombre imagen}]"
    
    example "Request: "+Rails.application.config.site_url+"/api/v1/customers/1/policies/1/validate_payment\n
	Salida:
    {
        id: 1,
        customer_id: 1,
        address_assinged: 'principal',
        labor_price: 3000,
        items_price: 0,
        viatic_price: 0,
        total_price: 3000,
        created_at: '2020-11-11T18:42:04.824Z',
        updated_at: '2020-11-11T18:42:04.824Z',
        customer_products: [{...}],
        policy_customer_products: [{...}]
    }
    "
	def validate_policy_payment
		@customer_policy = ApiSingleton.get_validate_policy_payment_api(customer_policy_params)
        if (@customer_policy["id"] rescue false)
            render json: @customer_policy.to_json
        else
            render json: @customer_policy, status: :bad_request
        end
    end
    
    ########################
	### Customer Services
	########################

	api :POST, "/v1/customers/:customer_id/create_service", "Asigna un nuevo servicio a un cliente en Miele Core. Si existe uno previo sin pagar, trae ese."
	param :service_id, String, :desc => "ID si es que existe" 
	param :customer_id, String, :desc => "ID del cliente a asignar el servicio" 
	param :address, String, :desc => "Dirección del cliente seleccionada. 'principal' o el id de alguna adicional"
	param :address_fn, String, :desc => "Dirección de facturación del cliente seleccionada. 'principal' o el id de alguna adicional"
	param :service_type, String, :desc => "Tipo de servicio del cliente. ['Instalación', 'Mantenimiento', 'Reparación', 'Home Program', 'Reparaciones en Taller', 'Entregas/Despachos']"
	param :subcategory, String, :desc => "Sub categoria del servicio del cliente"
	param :requested, String, :desc => "Describe si el servicio es solicitado por 'Cliente directo'' o por 'Distribuidor autorizado'."
	param :request_channel, String, :desc => "Canal de la solicitud de servicio. ['Teléfono', 'App Clientes', 'Web', 'Redes sociales'] "
	param :distributor_name, String, :desc => "Nombre del distribuidor autorizado, si aplica"
	param :distributor_email, String, :desc => "Email del distribuidor autorizado, si aplica"
	param :customer_products_id, String, :desc => "Array de ids de producos del usuario separados por coma (1,2,3), asociado al servicio" 
	param :technicians_number, String, :desc => "Número de técnicos necesarios para el servicio"
	param :hour_amount, String, :desc => "Monto por cada hora de servicio"
	param :fee_amount, String, :desc =>  "Monto de fee"
	param :labor_amount, String, :desc =>  "Monto de mano de obra"
    param :viatic_amount, String, :desc =>  "Monto por viaticos"
    param :total_hours, String, :desc =>  "Total de horas del servicio"
	param :total_amount, String, :desc => "Monto total del servicio"
    param :status, String, :desc => "Estado en el que se encuentra el serivio ['new','paid','completed']"
    param :background, String, :desc => "Antecedentes extras al servicio solicitado"
	param :no_payment, String, :desc => "true o false si es que se realiza pago o no"
	param :payment_channel, String, :desc => "Canal del pago si se realiza (Online, Transferencia, Por Teléfono)"
	param :payment_date, String, :desc => "Fecha límite de pago"
	param :no_payment_reason, String, :desc => "Razón de no pago"
    param :invoice, String, :desc => "true o false si el cliente requiere factura o no"
    param :event_start, String, :desc => "Fecha y hora de inicio del evento de agendamiento"
    param :event_end, String, :desc => "Fecha y hora de fin del evento de agendamiento"
    param :technicians_ids, String, :desc => "IDs de los técnicos separados por coma"
    param :images, Array, :desc => "Array de imagenes a asociar images:[{uri: [path de la imagen], mime: [formato], uri_64: [imagen en base 64], filename: [nombre imagen}]"
    param :payment_state, String, :desc => "Esto del pago (pendding, paid, failure)"
    param :isPaymentEmail, String, :desc => "Valor booleano para determinar envío de correo de pago. Envar 'true' para efectuar envío. "
    param :customerEmail, String, :desc => "Email del cliente que recibirá el correo"
    param :paymentEmailAdditional, String, :desc => "Email adicional del cliente que recibirá el correo"
    param :from, String, :desc => "Aplicación desde donde se esta generado el servicio. Use el valor 'app_web' para miele tickets web, 'app_clientes' y 'app_tecnicos' para las aplicaciones respectivas."
    param :policy_id, String, :desc => "ID de la póliza si es servicio de 'Póliza de Mantenimiento'."
    
    example "Request: "+Rails.application.config.site_url+"/api/v1/customers/1/create_service\n
    Salida:
    {
        id: 1,
        customer_id: 1,
        address: 'principal',
        service_type: 'Instalación',
        subcategory: 'Profesional',
        requested: 'test requested',
        request_channel: 'test request_channel',
        distributor_name: 'test distributor_name',
        distributor_email: 'test distributor_email',
        created_at: '17/11/2020 14:00:05',
        updated_at: '17/11/2020 14:00:05',
        technicians_number: 1,
        hour_amount: 8000,
        fee_amount: 40000,
        total_hours: 8,
        total_amount: 936,
        status: 'new',
        background: 'test background',
        no_payment: false,
        payment_channel: 'phone',
        payment_date: null,
        no_payment_reason: 'test no_payment_reason',
        invoice: true,
        payment_state: 'pending',
        job_id: null,
        number: 'TEST000001',
        address_fn: 'principal',
        customer_products: [],
        calendar_events: [ ],
        file_resources: [ ],
        status_label: 'Pre-agendado',
        visit_number: 0,
        ibs_number: 'TESTIBSNUMBER'
        }
    "
    def create_service
        @customer_service = ApiSingleton.get_create_customer_service_api(service_params)
        if (@customer_service["id"] rescue false)
            UserNotification.notify_service_visit_prescheduled(@customer_service, "service")
            
            render json: @customer_service.to_json
        else
            render json: @customer_service, status: :bad_request
        end
	end
	
	api :PATCH, "/v1/customers/:customer_id/services/:service_id/update_service", "Actualiza una servicio de un cliente en Miele Core"
	param :service_id, String, :desc => "ID del servicio a actualizar" 
	param :customer_id, String, :desc => "ID del cliente a asignar el servicio" 
	param :address, String, :desc => "Dirección del cliente seleccionada. 'principal' o el id de alguna adicional"
	param :address_fn, String, :desc => "Dirección de facturación del cliente seleccionada. 'principal' o el id de alguna adicional"
	param :service_type, String, :desc => "Tipo de servicio del cliente. ['Instalación', 'Mantenimiento', 'Reparación', 'Home Program', 'Reparaciones en Taller', 'Entregas/Despachos']"
	param :subcategory, String, :desc => "Sub categoria del servicio del cliente"
	param :requested, String, :desc => "Describe si el servicio es solicitado por 'Cliente directo'' o por 'Distribuidor autorizado'."
	param :request_channel, String, :desc => "Canal de la solicitud de servicio. ['Teléfono', 'App Clientes', 'Web', 'Redes sociales'] "
	param :distributor_name, String, :desc => "Nombre del distribuidor autorizado, si aplica"
	param :distributor_email, String, :desc => "Email del distribuidor autorizado, si aplica"
	param :customer_products_id, String, :desc => "Array de ids de producos del usuario separados por coma (1,2,3), asociado al servicio" 
	param :technicians_number, String, :desc => "Número de técnicos necesarios para el servicio"
	param :hour_amount, String, :desc => "Monto por cada hora de servicio"
	param :labor_amount, String, :desc =>  "Monto de mano de obra por viaticos"
    param :fee_amount, String, :desc =>  "Monto de fee por viaticos"
	param :total_hours, String, :desc =>  "Total de horas del servicio"
	param :subtotal_amount, String, :desc => "Monto subtotal del servicio"
    param :iva_amount, String, :desc => "Monto iva del servicio"
    param :total_amount, String, :desc => "Monto total del servicio"
    param :status, String, :desc => "Estado en el que se encuentra el serivio ['new','paid','completed']" 
    param :background, String, :desc => "Antecedentes extras al servicio solicitado"
	param :no_payment, String, :desc => "true o false si es que se realiza pago o no"
	param :payment_channel, String, :desc => "Canal del pago si se realiza (Online, Transferencia, Por Teléfono)"
	param :payment_date, String, :desc => "Fecha límite de pago"
	param :no_payment_reason, String, :desc => "Razón de no pago"
    param :invoice, String, :desc => "true o false si el cliente requiere factura o no"
    param :event_start, String, :desc => "Fecha y hora de inicio del evento de agendamiento"
    param :event_end, String, :desc => "Fecha y hora de fin del evento de agendamiento"
    param :technicians_ids, String, :desc => "IDs de los técnicos separados por coma"
	param :images, Array, :desc => "Array de imagenes a asociar images:[{uri: [path de la imagen], mime: [formato], uri_64: [imagen en base 64], filename: [nombre imagen}]"
    param :payment_state, String, :desc => "Esto del pago (pendding, paid, failure)"
    param :isPaymentEmail, String, :desc => "Valor booleano para determinar envío de correo de pago. Envar 'true' para efectuar envío. "
    param :customerEmail, String, :desc => "Email del cliente que recibirá el correo"
    param :paymentEmailAdditional, String, :desc => "Email adicional del cliente que recibirá el correo"
    param :payment_files, Array, :desc => "Array de archivos asociados al pago payment_files:[{uri: [path de la imagen], mime: [formato], uri_64: [imagen en base 64], filename: [nombre imagen}]"
    param :ibs_number, String, :desc => "Numero de IBS para el servicio en particular"
    param :spare_part_delivery_date, String, :desc => "Fecha de llegada de las refaccciones"
    param :principal_technician, String, :desc => "ID del técnico principal"
    param :requested_spare_parts_ids, String, :desc => "IDs de las refacciones requeridas separadas por ,"
    param :validated_payment, String, :desc => "true o false si se esta validando el pago."
    param :from, String, :desc => "Aplicación desde donde se esta generado el servicio. Use el valor 'app_web' para miele tickets web, 'app_clientes' y 'app_tecnicos' para las aplicaciones respectivas."
    param :background_prediagnosis, String, :desc => "Observaciones de prediagnostico"
    param :consumables, Array, :desc => "consumables: [:amount, :total_boxes, :product_id]"
    param :submit_type, String, :desc => "Enviar 'spare_part_submit' para asignar refacciones a téncnico principal"
    param :notification, String, :desc => "Enviar 'app_clientes' para generar notificacion"
    example "Request: "+Rails.application.config.site_url+"/api/v1/customers/1/services/1/update_service\n
    Salida:
    {
        id: 1,
        customer_id: 1,
        address: 'principal',
        service_type: 'Instalación',
        subcategory: 'Profesional',
        requested: 'test updated requested',
        request_channel: 'test updated request_channel',
        distributor_name: 'test updated distributor_name',
        distributor_email: 'test updated distributor_email',
        created_at: '17/11/2020 14:00:05',
        updated_at: '17/11/2020 14:00:05',
        technicians_number: 1,
        hour_amount: 8000,
        fee_amount: 40000,
        total_hours: 8,
        total_amount: 936,
        status: 'new',
        background: 'test updated background',
        no_payment: false,
        payment_channel: 'phone',
        payment_date: null,
        no_payment_reason: 'test updated no_payment_reason',
        invoice: true,
        payment_state: 'pending',
        job_id: null,
        number: 'UPDATED000001',
        address_fn: 'principal',
        customer_products: [],
        calendar_events: [ ],
        file_resources: [ ],
        status_label: 'Pre-agendado',
        visit_number: 0,
        ibs_number: 'TESTIBSNUMBERUPDATED'
        }
    "
    def update_service
        @customer_service = ApiSingleton.get_update_customer_service_api(params)
        
        if (@customer_service["id"] rescue false)
            if params[:submit_type] != 'finish_submit' && (params[:submit_type] != 'generate_service_without_payment' && params[:submit_type] != 'app_clientes_submit')
                UserNotification.notify_audit_concluded(@customer_service)
            end
                
            if params[:submit_type] == "prediagnosis_submit"
                UserNotification.notify_service_prediagnosis_submit(@customer_service)
            end
            if params[:notification] && params[:notification] == "app_clientes"
                UserNotification.notify_service_visit_prescheduled(@customer_service, "service")
                send_payment_email
            end
            render json: @customer_service.to_json
        else
            render json: @customer_service, status: :bad_request
        end
	end


    api :POST, "/v1/customer_products/:id/assign_spare_parts", "Asigna refacciones a un técnico en una visita en Miele Core"
	param :id, String, :desc => "ID del producto a asignar la refacción, enviar no_tech, para dejarlo asociado al tecnico" 
	param :service_spare_part_ids, String, :desc => "IDs de las refaccionnes separadas por ,"
	param :quantities, String, :desc => "Cantidades a asignar separadas por ,"
	param :warranties, String, :desc => "Garantiás de las refacciones separadas por ,"
	param :visit_id, String, :desc => "ID de la vista en la que se esta usando la refaccion (opcional)"
	
	example "Request: "+Rails.application.config.site_url+"/api/v1/customer_products/1/assign_spare_parts\n
	Salida:
    [
		{
		'id': 1,
		'customer_product_id': 1,
		'service_spare_part_id': 3,
		'quantity': 3,
		'created_at': '2021-03-03T21:56:29.017Z',
		'updated_at': '2021-03-03T22:28:58.532Z'
		},
		{
		'id': 2,
		'customer_product_id': 1,
		'service_spare_part_id': 1,
		'quantity': 2,
		'created_at': '2021-03-03T22:28:58.519Z',
		'updated_at': '2021-03-03T22:28:58.519Z'
		}
	]
    "
	def  assign_product_spare_parts
		@customer_products_service_spare_parts = ApiSingleton.get_customer_products_assign_product_spare_parts(customer_products_service_spare_parts_params)
        
        if (@customer_products_service_spare_parts.any? rescue false)
            render json: @customer_products_service_spare_parts.to_json
        else
            render json: @customer_products_service_spare_parts, status: :bad_request
        end
	end

    api :POST, "/v1/customer_products/:id/reintegrate_product_spare_parts", "Asigna refacciones a un técnico en una visita en Miele Core"
	param :id, String, :desc => "ID del producto a asignar la refacción, enviar no_tech, para dejarlo asociado al tecnico" 
	param :customer_product_service_spare_part_ids, String, :desc => "IDs de las refaccionnes separadas por ,"
	param :quantities, String, :desc => "Cantidades a asignar separadas por ,"
	param :technician_id, String, :desc => "ID del ténico que reintegra las refacciones."
	example "Request: "+Rails.application.config.site_url+"/api/v1/customer_products/1/reintegrate_product_spare_parts\n
	Salida:
    [
		{
		'id': 1,
		'customer_product_id': 1,
		'service_spare_part_id': 3,
		'quantity': 3,
		'created_at': '2021-03-03T21:56:29.017Z',
		'updated_at': '2021-03-03T22:28:58.532Z'
		},
		{
		'id': 2,
		'customer_product_id': 1,
		'service_spare_part_id': 1,
		'quantity': 2,
		'created_at': '2021-03-03T22:28:58.519Z',
		'updated_at': '2021-03-03T22:28:58.519Z'
		}
	]
    "
	def  reintegrate_product_spare_parts
		@customer_products_service_spare_parts = ApiSingleton.get_customer_products_reintegrate_product_spare_parts(customer_products_service_spare_parts_params)
        
        if (@customer_products_service_spare_parts.any? rescue false)
            render json: @customer_products_service_spare_parts.to_json
        else
            render json: @customer_products_service_spare_parts, status: :bad_request
        end
	end



    api :GET, "/v1/customer_products/:id/customer_product_used_spare_parts", "Trae todas a reafacciones usadas en un producto en Miele Core"
	param :id, String, :desc => "ID del producto a consultar"
    param :service_id, String, :desc => "ID del servicio, para filtrar"
    param :visit_id, String, :desc => "ID la visita"
    
	example "Request: "+Rails.application.config.site_url+"/v1/customer_products/1/customer_product_used_spare_parts/\n
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
	def customer_product_used_spare_parts
		@service_products_used = ApiSingleton.get_customer_products_product_spare_parts(customer_products_service_spare_parts_params)
			
		if @service_products_used.any?
			render json:  @service_products_used.to_json
		else
			render json:  @service_products_used, status: :bad_request
		end
	end

    api :GET, "/v1/customer_products/:customer_product_id/customer_product_requested_spare_parts", "Trae las refacciones solicitadas de un producto"
	param :customer_product_id, String, :desc => "ID del producto de la visita"
    param :visit_id, String, :desc => "ID la visita"
    
    example "Request: "+Rails.application.config.site_url+"/api/v1/customer_products/1/customer_product_requested_spare_parts\n
	Salida:
    [
        {
            id: 1,
            service_id: 1,
            product_id: 1,
			customer_product_id: 1,
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
	def customer_product_requested_spare_parts
		@service_products_requested = ApiSingleton.get_customer_products_product_requested_spare_parts(customer_products_service_spare_parts_params)
			
		if @service_products_requested.any?
			render json:  @service_products_requested.to_json
		else
			render json:  @service_products_requested, status: :bad_request
		end
	end



    api :GET, "/v1/customer_products/getCheckStates", "Verifica que la información de checklist y carácterísticas este completa"
	param :customer_product_ids, String, :desc => "ID de los productos del cliente a consultar, separados por ,"
	param :visit_id, String, :desc => "ID de la visita que se desea verificar su información"
	
    example "Request: "+Rails.application.config.site_url+"/api/v1/customer_products/getCheckStates\n
	Salida:
	  [
		{
		  id: 377, cpd: false, cpi: true
		},
		{
		  id: 468, cpd: true, cpi:true
		}
	  ]
	"
	def getCheckStates
        @getCheckStates = ApiSingleton.get_customer_products_getCheckStates(params)
    
        if (@getCheckStates.any? rescue false)
            render json: @getCheckStates.to_json
        else
            render json: @getCheckStates, status: :bad_request
        end
	end


    ########################
	### Complaints
	########################
	
    api :GET, "/v1/customers/:id/complaints", "Trae las quejas de cliente en Miele Core"
	param :id, String, :desc => "ID del servicio al que pertenece la refacción" 
	example "Request: "+Rails.application.config.site_url+"/api/v1/customers/1/complaints/1\n
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
	def complaints
		render json:  ApiSingleton.customer_complaints_api(params[:id])
	end

	api :POST, "/v1/customers/:id/create_complaint", "Crea una nueva queja de un cliente en Miele Core"
	param :id, String, :desc => "Id del cliente"
    param :service_id, String, :desc => "Id del servicio de la queja"
	param :complaint_type, String, :desc => "Tipo de la queja"
	param :channel, String, :desc => "Canal de la queja"
	param :phone, String, :desc => "Telefono asociado a la queja"
	param :complaint_background, String, :desc => "Detalle de la queja"
	param :compensation_proposal, String, :desc => "Propuesta de compensación de la queja"
	param :closure_details, String, :desc => "Detalles del cierre de la queja"
    param :compensation_proposal_2, String, :desc => "Propuesta de compensación 2 de la queja"
	param :closure_details_2, String, :desc => "Detalles del cierre 2 de la queja"
     example "Request: "+Rails.application.config.site_url+"/api/v1/customers/:id/create_complaint\n
	Salida:
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
	"
	def create_complaint
		@complaint =  ApiSingleton.create_customer_complaint_api(customer_complaints_params)
        if (@complaint["id"] rescue false)
            UserNotification.notify_complaint_create(@complaint)
            render json: @complaint.to_json
        else
            render json: @complaint, status: :bad_request
        end
	end

	api :PATCH, "/v1/customers/:id/update_complaint", "Actualiza queja de un cliente en Miele Core"
	param :complaint_id, String, :desc => "ID de la queja del cliente"
    param :id, String, :desc => "Id del cliente"
    param :service_id, String, :desc => "Id del servicio de la queja"
	param :complaint_type, String, :desc => "Tipo de la queja"
	param :channel, String, :desc => "Canal de la queja"
	param :phone, String, :desc => "Telefono asociado a la queja"
	param :complaint_background, String, :desc => "Detalle de la queja"
	param :compensation_proposal, String, :desc => "Propuesta de compensación de la queja"
	param :closure_details, String, :desc => "Detalles del cierre de la queja"
    param :compensation_proposal_2, String, :desc => "Propuesta de compensación 2 de la queja"
	param :closure_details_2, String, :desc => "Detalles del cierre 2 de la queja"
    
    example "Request: "+Rails.application.config.site_url+"/api/v1/customers/:id/update_complaint\n
	Salida:
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
	"
	def update_complaint
		@complaint =  ApiSingleton.update_customer_complaint_api(customer_complaints_params)
        if (@complaint["id"] rescue false)
            UserNotification.notify_complaint_update(@complaint)
            render json: @complaint.to_json
        else
            render json: @complaint, status: :bad_request
        end
	end


  def assign_unit_real_state
    response = ApiSingleton.assign_unit_real_state(params)

    if response["id"]
      render json: response.to_json
    else
      render json: response, status: :bad_request
    end
  end


  api :GET, '/v1/customers/:id/unit_real_states', "Retorna los clientes del core filtrados por la plataforma 'Tickets' y paginados"
  param :id, String, desc: 'ID del cliente que se le consultan las unidades inmobiliarias'
  example 'Request: ' + Rails.application.config.site_url + "/api/v1/v1/customers/1/unit_real_states\n
	Salida:
        {
            data: [
                {... unit_real_state},
                {... unit_real_state},
                {... unit_real_state},
                {... unit_real_state},
                {... unit_real_state},
                {... unit_real_state},
                {... unit_real_state},
                {... unit_real_state},
                {... unit_real_state},
                {... unit_real_state}
            ]
        }
	"
  def unit_real_states
    response = ApiSingleton.customer_unit_real_states(params)

    if response["data"]
      render json: response.to_json
    else
      render json: response, status: :bad_request
    end
  end


    private

    def send_payment_email
        if (@customer_service["id"] && @customer_service["is_presheduled"] rescue false)
            emails = (@customer_service["new_visit"]["customer_email"].blank? ? params[:customerEmail].blank? ? "oferusat@gmail.com" : params[:customerEmail] : @customer_service["new_visit"]["customer_email"])
            emails+= ",#{params[:paymentEmailAdditional]}" unless  params[:paymentEmailAdditional].blank?
            begin
                NotificationMailer.payment_email(emails, params[:service_id]).deliver_now
            rescue 
                puts "No se ha podido enviar el email."
            end
        end
    end

    def customer_params
        params.permit(:id, :names, :lastname, :surname, :email, :zipcode, :state, :delegation, :colony, :street_type, :street_name, :ext_number, :int_number, :phone, :cellphone, :reference, :business_name, :rfc, :email_fn, :zipcode_fn, :state_fn, :delegation_fn, :colony_fn, :street_type_fn, :street_name_fn, :ext_number_fn, :int_number_fn, :phone_fn, :person_type, :country, :rut, :email2, :commercial_business, :tradename, :customer_id)
    end

    def customer_project_params
        params.permit(:id, :selected_customer, :nombre_inmobiliaria, :nombre_proyecto, :street_type_project, :state_project, :street_name_project, :ext_number_project, :business_name_project, :commercial_business_project, :rfc_project, :reference_project, :nombre_contacto, :last_name_contact, :surname_contact, :email_contact, :state_contact, :street_type_contact, :street_name_contact, :int_number_contact, :ext_number_contact, :cell_phone_contact, :phone_contact)
    end

    def additional_address_params
        params.permit(:id, :customer_id, :name, :zipcode, :state, :delegation, :colony, :street_type, :street_name, :ext_number, :int_number, :country)
    end

    def customer_product_params
        params.permit(:id, :customer_id, :product_id, :created_at, :updated_at, :status, :warranty, :dispatchgroup_id, :quotation_id, :policy, :products)
    end

    def customer_product_update_params 
        params.permit(:id, :customer_id, :customer_product_id, :tnr, :business_unit, :family, :subfamily, :specific, :product_name, :discontinued, :instalation_date, :technical_diagnosis, :expert_opinion, :activity_performed, :warranty,:status, :dispatchgroup_id, :quotation_id, :visit_id, images: [])
    end


    def customer_product_additional_params
        params.permit(:id, :customer_id, :business_unit, :family, :subfamily, :product_name, :quantity)
    end

    def customer_policy_params
        params.permit(:id, :policy_id, :customer_id, :customer_products_id, :address_assinged, :labor_price, :items_price, :viatic_price, :iva_amount, :subtotal_price, :total_price, payment_files: [])
    end
    
    def service_params
        params.permit(:id, :service_id, :policy_id, :from, :customer_id, :address, :address_fn, :service_type, :subcategory, :requested, :request_channel, :distributor_name, :distributor_email, :technicians_number, :hour_amount, :fee_amount, :labor_amount, :viatic_amount, :total_hours, :subtotal_amount, :iva_amount, :total_amount, :status, :customer_products_id, :background, :no_payment, :payment_channel, :payment_date, :no_payment_reason, :invoice, :event_start, :event_end, :technicians_ids, :payment_state, :customer_payment_date, :cost_center_id, :spare_parts_amount, images: [], consumables: [])
    end
    
    def update_service_params
        params.permit(:id, :service_id, :policy_id, :from, :customer_id, :address, :service_type, :subcategory, :requested, :request_channel, :distributor_name, :distributor_email, :technicians_number, :hour_amount, :fee_amount, :total_hours, :total_amount, :status, :customer_products_id, :background, :background_prediagnosis, :no_payment, :payment_channel, :payment_date, :no_payment_reason, :invoice, :event_start, :event_end, :technicians_ids, :payment_state, :ibs_number, :customer_payment_date, :background_cancel_service, :cancel_reason, :do_cancel_service, :spare_part_delivery_date, :principal_technician, :requested_spare_parts_ids, :validated_payment, images:[:uri, :mime, :uri_64, :name,:filename], payment_files: [], consumables: [:amount, :total_boxes, :product_id])
    end

    def customer_products_service_spare_parts_params
        params.permit(:id, :service_id, :service_spare_part_ids, :customer_product_service_spare_part_ids, :quantities, :warranties, :customer_product_id, :technician_id, :visit_id)
    end

    def customer_complaints_params
        params.permit(:complaint_id, :id, :service_id, :complaint_type, :channel, :phone, :complaint_background, :compensation_proposal, :closure_details, :compensation_proposal_2, :closure_details_2, :stage)
    end
end

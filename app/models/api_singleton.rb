class ApiSingleton
	#URL_DEV = 'https://mielecore.garagelabs.cl'
  # TODO: La configuración de la conexión debe configurarse por secrets
  @@current_locale = nil

  URLS = {
    development: 'http://app_core:8000',
    staging: 'https://mielecore.garagelabs.cl',
    production: 'https://core.mielecustomers.cl',
    pre_production: 'https://preprod.mielecore.garagelabs.cl'
  }.freeze

  TOKENS = {
    development: 'wbBsf6O6fpJBvFschcsvUAtt',
    staging: 'wbBsf6O6fpJBvFschcsvUAtt',
    production: 'quard7eXXnXllrJ7QQsZbwtt',
    pre_production: 'ZYLTpLYB7oCSVCBFzIjueAtt'
  }.freeze

  URL_API = URLS[Rails.env.downcase.to_sym]
	API_TOKEN = TOKENS[Rails.env.downcase.to_sym]
  API_TOKEN_DEV = TOKENS[Rails.env.downcase.to_sym]
  # TODO: Remove tokens auth per request, add on the defaults headors on faraday block
	
  # Countries
  def self.all_countries
		response = api_connection.get do |req|
			req.url ("/api/v1/countries")
			req.headers["Authorization"] = "Token token=#{(Rails.env.development? ? API_TOKEN_DEV : API_TOKEN)}"
			req.options.timeout = 60
			end
		JSON.parse(response.body)
  end

	def self.project_show(id)
		response = api_connection.get do |req|
			if Rails.env.test?
				req.url "http://localhost:3000/project_customer_t.json"
			else
				req.url ("/api/v1/projects/#{id}")
			end 
			req.headers["Authorization"] = "Token token=#{(Rails.env.development? ? API_TOKEN_DEV : API_TOKEN)}"
			req.options.timeout = 60
			puts req
			end
		JSON.parse(response.body)
	end


	####################################################################
	# CUSTOMER PROJECT
	###################################################################
	def self.get_project_customer_api(rfc)
		response = api_connection.get do |req|
			if Rails.env.test?
				req.url "http://localhost:3000/project_customer_t.json"
			else
				req.url ("/api/v1/project_customers/no_id?rfc="+ rfc.to_s)
			end 
			req.headers["Authorization"] = "Token token=#{(Rails.env.development? ? API_TOKEN_DEV : API_TOKEN)}"
			req.options.timeout = 60
			puts req
			end
		return JSON.parse(response.body)
	end

	def self.create_project_customer_api(project_customer_params)
		response = api_connection.post do |req|
				if Rails.env.test?
					req.url "http://localhost:3000/api/v1/project_customer_t.json"
				else
					req.url ("/api/v1/project_customers")
				end 
				req.headers["Authorization"] = "Token token=#{(Rails.env.development? ? API_TOKEN_DEV : API_TOKEN)}"
				req.options.timeout = 60
				body_t = {}
				body_t["nombre_inmobiliaria"] =  project_customer_params[:nombre_inmobiliaria].nil? ? "Sin Información" : project_customer_params[:nombre_inmobiliaria]
				body_t["business_name_project"] = project_customer_params[:business_name_project].nil? ? "Sin Información" : project_customer_params[:business_name_project]
				body_t["rfc_project"] = project_customer_params[:rfc_project].nil? ? "Sin Información" : project_customer_params[:rfc_project]
				body_t["commercial_business_project"] = project_customer_params[:commercial_business_project].nil? ? "Sin Información" : project_customer_params[:commercial_business_project]
				body_t["nombre_proyecto"] = project_customer_params[:nombre_proyecto].nil? ? "Sin Información" : project_customer_params[:nombre_proyecto]
				body_t["street_type_project"] = project_customer_params[:street_type_project].nil? ? "Sin Información" : project_customer_params[:street_type_project]
				body_t["street_name_project"] = project_customer_params[:street_name_project].nil? ? "Sin Información" : project_customer_params[:street_name_project]
				body_t["state_project"] = project_customer_params[:state_project].nil? ? "Sin Información" :  project_customer_params[:state_project]
				body_t["ext_number_project"] = project_customer_params[:ext_number_project].nil? ? "Sin Información" : project_customer_params[:ext_number_project]
				body_t["reference_project"] = project_customer_params[:reference_project].nil? ? "Sin Información" : project_customer_params[:reference_project]
				body_t["nombre_contacto"] =  project_customer_params[:nombre_contacto].nil? ? "Sin Información" : project_customer_params[:nombre_contacto]
				body_t["last_name_contact"] = project_customer_params[:last_name_contact].nil? ? "Sin Información" : project_customer_params[:last_name_contact]
				body_t["surname_contact"] = project_customer_params[:surname_contact].nil? ? "Sin Información" : project_customer_params[:surname_contact]
				body_t["email_contact"] = project_customer_params[:email_contact].nil? ? "Sin Información" : project_customer_params[:email_contact]
				body_t["street_type_contact"] = project_customer_params[:street_type_contact].nil? ? "Sin Información" : project_customer_params[:street_type_contact]
				body_t["state_contact"] = project_customer_params[:state_contact].nil? ? "Sin Información" : project_customer_params[:state_contact]
				body_t["street_name_contact"] = project_customer_params[:street_name_contact].nil? ? "Sin Información" : project_customer_params[:street_name_contact]
				body_t["ext_number_contact"] = project_customer_params[:ext_number_contact].nil? ? "Sin Información" : project_customer_params[:ext_number_contact]
				body_t["int_number_contact"] = project_customer_params[:int_number_contact].nil? ? "Sin Información" : project_customer_params[:int_number_contact]
				body_t["phone_contact"] = project_customer_params[:phone_contact].nil? ? "Sin Información" : project_customer_params[:phone_contact]
				body_t["cell_phone_contact"] = project_customer_params[:cell_phone_contact].nil? ? "Sin Información" : project_customer_params[:cell_phone_contact]
				
				req.body = body_t
				puts req
				end
		return JSON.parse(response.body)
	end 

  def self.project_customers_api(page = '1', per_page = '10', keywords = '', country = '')
    response = api_connection.get do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/customers_t.json'
      else
        req.url('/api/v1/project_customers?page=' + page.to_s + '&per_page=' + per_page.to_s + '&keywords=' + keywords + '&country=' + country)
      end
      req.params = {page: page, per_page: per_page, keywords: keywords, country: country}
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
    end
    JSON.parse(response.body || {})
  end

	####################################################################
	# CUSTOMER
	###################################################################

  def self.customers_api(page = '1', per_page = '10', filterText = '', country = '')
    response = api_connection.get do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/customers_t.json'
      else
        req.url('/api/v1/customers?page=' + page.to_s + '&per_page=' + per_page.to_s + '&keywords=' + filterText + '&country=' + country)
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  def self.get_customer_api(id, email = nil)
    response = api_connection.get do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/customer_t.json'
      else
        req.url('/api/v1/customers/' + id.to_s + '?email=' + email.to_s)
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  def self.create_customer_api(customer_params)
    response = api_connection.post do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/api/v1/customer_t.json'
      else
        req.url('/api/v1/customers')
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      body_t = {}
      body_t['names'] = customer_params[:names] unless customer_params[:names].nil?
      body_t['lastname'] = customer_params[:lastname] unless customer_params[:lastname].nil?
      body_t['surname'] = customer_params[:surname] unless customer_params[:surname].nil?
      body_t['email'] = customer_params[:email] unless customer_params[:email].nil?
      body_t['zipcode'] = customer_params[:zipcode] unless customer_params[:zipcode].nil?
      body_t['state'] = customer_params[:state] unless customer_params[:state].nil?
      body_t['delegation'] = customer_params[:delegation] unless customer_params[:delegation].nil?
      body_t['colony'] = customer_params[:colony] unless customer_params[:colony].nil?
      body_t['street_type'] = customer_params[:street_type] unless customer_params[:street_type].nil?
      body_t['street_name'] = customer_params[:street_name] unless customer_params[:street_name].nil?
      body_t['ext_number'] = customer_params[:ext_number] unless customer_params[:ext_number].nil?
      body_t['int_number'] = customer_params[:int_number] unless customer_params[:int_number].nil?
      body_t['phone'] = customer_params[:phone] unless customer_params[:phone].nil?
      body_t['cellphone'] = customer_params[:cellphone] unless customer_params[:cellphone].nil?
      body_t['reference'] = customer_params[:reference] unless customer_params[:reference].nil?
      body_t['business_name'] = customer_params[:business_name] unless customer_params[:business_name].nil?
      body_t['rfc'] = customer_params[:rfc] unless customer_params[:rfc].nil?
      body_t['email_fn'] = customer_params[:email_fn] unless customer_params[:email_fn].nil?
      body_t['zipcode_fn'] = customer_params[:zipcode_fn] unless customer_params[:zipcode_fn].nil?
      body_t['state_fn'] = customer_params[:state_fn] unless customer_params[:state_fn].nil?
      body_t['delegation_fn'] = customer_params[:delegation_fn] unless customer_params[:delegation_fn].nil?
      body_t['colony_fn'] = customer_params[:colony_fn] unless customer_params[:colony_fn].nil?
      body_t['street_type_fn'] = customer_params[:street_type_fn] unless customer_params[:street_type_fn].nil?
      body_t['street_name_fn'] = customer_params[:street_name_fn] unless customer_params[:street_name_fn].nil?
      body_t['ext_number_fn'] = customer_params[:ext_number_fn] unless customer_params[:ext_number_fn].nil?
      body_t['int_number_fn'] = customer_params[:int_number_fn] unless customer_params[:int_number_fn].nil?
      body_t['phone_fn'] = customer_params[:phone_fn] unless customer_params[:phone_fn].nil?
      body_t['person_type'] = customer_params[:person_type] unless customer_params[:person_type].nil?
      body_t['country_id'] = customer_params[:country] unless customer_params[:country].nil?
      body_t['rut'] = customer_params[:rut] unless customer_params[:rut].nil?
      body_t['email2'] = customer_params[:email2] unless customer_params[:email2].nil?
      unless customer_params[:commercial_business].nil?
        body_t['commercial_business'] =
          customer_params[:commercial_business]
      end
      body_t['tradename'] = customer_params[:tradename] unless customer_params[:tradename].nil?

      req.body = body_t
      puts req
    end
    JSON.parse(response.body)
  end

  def self.update_customer_api(id, customer_params)
    response = api_connection.patch do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/api/v1/customer_t.json'
      else
        req.url('/api/v1/customers/' + id.to_s)
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      body_t = {}
      body_t['id'] = id
      body_t['names'] = customer_params[:names] unless customer_params[:names].nil?
      body_t['lastname'] = customer_params[:lastname] unless customer_params[:lastname].nil?
      body_t['surname'] = customer_params[:surname] unless customer_params[:surname].nil?
      body_t['email'] = customer_params[:email] unless customer_params[:email].nil?
      body_t['zipcode'] = customer_params[:zipcode] unless customer_params[:zipcode].nil?
      body_t['state'] = customer_params[:state] unless customer_params[:state].nil?
      body_t['delegation'] = customer_params[:delegation] unless customer_params[:delegation].nil?
      body_t['colony'] = customer_params[:colony] unless customer_params[:colony].nil?
      body_t['street_type'] = customer_params[:street_type] unless customer_params[:street_type].nil?
      body_t['street_name'] = customer_params[:street_name] unless customer_params[:street_name].nil?
      body_t['ext_number'] = customer_params[:ext_number] unless customer_params[:ext_number].nil?
      body_t['int_number'] = customer_params[:int_number] unless customer_params[:int_number].nil?
      body_t['phone'] = customer_params[:phone] unless customer_params[:phone].nil?
      body_t['cellphone'] = customer_params[:cellphone] unless customer_params[:cellphone].nil?
      body_t['reference'] = customer_params[:reference] unless customer_params[:reference].nil?
      body_t['business_name'] = customer_params[:business_name] unless customer_params[:business_name].nil?
      body_t['rfc'] = customer_params[:rfc] unless customer_params[:rfc].nil?
      body_t['email_fn'] = customer_params[:email_fn] unless customer_params[:email_fn].nil?
      body_t['zipcode_fn'] = customer_params[:zipcode_fn] unless customer_params[:zipcode_fn].nil?
      body_t['state_fn'] = customer_params[:state_fn] unless customer_params[:state_fn].nil?
      body_t['delegation_fn'] = customer_params[:delegation_fn] unless customer_params[:delegation_fn].nil?
      body_t['colony_fn'] = customer_params[:colony_fn] unless customer_params[:colony_fn].nil?
      body_t['street_type_fn'] = customer_params[:street_type_fn] unless customer_params[:street_type_fn].nil?
      body_t['street_name_fn'] = customer_params[:street_name_fn] unless customer_params[:street_name_fn].nil?
      body_t['ext_number_fn'] = customer_params[:ext_number_fn] unless customer_params[:ext_number_fn].nil?
      body_t['int_number_fn'] = customer_params[:int_number_fn] unless customer_params[:int_number_fn].nil?
      body_t['phone_fn'] = customer_params[:phone_fn] unless customer_params[:phone_fn].nil?
      body_t['person_type'] = customer_params[:person_type] unless customer_params[:person_type].nil?
      body_t['country_id'] = customer_params[:country] unless customer_params[:country].nil?
      body_t['rut'] = customer_params[:rut] unless customer_params[:rut].nil?
      body_t['email2'] = customer_params[:email2] unless customer_params[:email2].nil?
      unless customer_params[:commercial_business].nil?
        body_t['commercial_business'] =
          customer_params[:commercial_business]
      end
      body_t['tradename'] = customer_params[:tradename] unless customer_params[:tradename].nil?
      req.body = body_t
      puts req
    end
    JSON.parse(response.body)
  end

  ####################################################################
  # CUSTOMER ADDITIONAL
  ###################################################################

  def self.create_customer_additional_api(customer_params)
    response = api_connection.post do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/api/v1/customer_t.json'
      else
        req.url('/api/v1/customersAdditional')
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      body_t = {}
      body_t['names'] = customer_params[:names]
      body_t['lastname'] = customer_params[:lastname]
      body_t['surname'] = customer_params[:surname]
      body_t['email'] = customer_params[:email]
      body_t['phone'] = customer_params[:phone]
      body_t['cellphone'] = customer_params[:cellphone]
      body_t['customer_id'] = customer_params[:customer_id]

      req.body = body_t
      puts req
    end
    JSON.parse(response.body)
  end

  def self.update_customer_additional_api(id, customer_params)
    response = api_connection.patch do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/api/v1/customer_t.json'
      else
        req.url('/api/v1/customersAdditional/' + id.to_s)
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      body_t = {}
      body_t['id'] = id
      body_t['names'] = customer_params[:names]
      body_t['lastname'] = customer_params[:lastname]
      body_t['surname'] = customer_params[:surname]
      body_t['email'] = customer_params[:email]
      body_t['phone'] = customer_params[:phone]
      body_t['cellphone'] = customer_params[:cellphone]
      body_t['customer_id'] = customer_params[:customer_id]

      req.body = body_t
      puts req
    end
    JSON.parse(response.body)
  end

  # 	def self.destroy_customer_additional_api(id)
  # 		response = api_connection.delete do |req|
  # 			if Rails.env.test?
  # 				req.url "http://localhost:3000/api/v1/customer_t.json"
  # 			else
  # 				req.url ("/api/v1/customersAdditional/"+id.to_s)
  # 			end
  # 			req.headers["Authorization"] = "Token token=#{(Rails.env.development? ? API_TOKEN_DEV : API_TOKEN)}"
  # 			req.options.timeout = 60
  # 			body_t = {}
  # 			body_t["id"] = id
  # 			req.body = body_t
  # 			puts req
  # 		end
  # 		return JSON.parse(response.body)
  # 	end

  ####################################################################
  # CUSTOMER ADDITIONAL ADDRESSS
  ###################################################################

  def self.create_customer_additional_address_api(additional_address_params)
    response = api_connection.post do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/api/v1/customer_t.json'
      else
        req.url('/api/v1/customersAdditionalAddress')
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      body_t = {}
      body_t['customer_id'] = additional_address_params[:customer_id]
      body_t['name'] = additional_address_params[:name]
      body_t['zipcode'] = additional_address_params[:zipcode]
      body_t['state'] = additional_address_params[:state]
      body_t['delegation'] = additional_address_params[:delegation]
      body_t['colony'] = additional_address_params[:colony]
      body_t['street_type'] = additional_address_params[:street_type]
      body_t['street_name'] = additional_address_params[:street_name]
      body_t['ext_number'] = additional_address_params[:ext_number]
      body_t['int_number'] = additional_address_params[:int_number]
      body_t['country_id'] = additional_address_params[:country]
      req.body = body_t
      puts req
    end
    JSON.parse(response.body)
  end

  def self.update_customer_additional_address_api(id, additional_address_params)
    response = api_connection.patch do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/api/v1/customer_t.json'
      else
        req.url('/api/v1/customersAdditionalAddress/' + id.to_s)
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      body_t = {}
      body_t['id'] = id
      body_t['customer_id'] = additional_address_params[:customer_id]
      body_t['name'] = additional_address_params[:name]
      body_t['zipcode'] = additional_address_params[:zipcode]
      body_t['state'] = additional_address_params[:state]
      body_t['delegation'] = additional_address_params[:delegation]
      body_t['colony'] = additional_address_params[:colony]
      body_t['street_type'] = additional_address_params[:street_type]
      body_t['street_name'] = additional_address_params[:street_name]
      body_t['ext_number'] = additional_address_params[:ext_number]
      body_t['int_number'] = additional_address_params[:int_number]
      body_t['country'] = additional_address_params[:country]
      body_t['administrativeDemarcations'] = additional_address_params[:administrativeDemarcations]

      req.body = body_t
      puts req
    end
    JSON.parse(response.body)
  end

  def self.destroy_customer_additional_address_api(id)
    response = api_connection.delete do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/api/v1/customer_t.json'
      else
        req.url('/api/v1/customersAdditionalAddress/' + id.to_s)
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      body_t = {}
      body_t['id'] = id
      req.body = body_t
      puts req
    end
    JSON.parse(response.body)
  end

  ####################################################################
  # CUSTOMER PRODUCTS
  ###################################################################

  def self.get_create_customer_products_api(customer_product_params)
    response = api_connection.post do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/api/v1/customer_t.json'
      else
        req.url('/api/v1/customers/' + customer_product_params[:customer_id] + '/create_product')
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      body_t = {}
      body_t['customer_id'] = customer_product_params[:customer_id]
      body_t['products'] = customer_product_params[:products]
      unless customer_product_params[:dispatchgroup_id].nil?
        body_t['dispatchgroup_id'] =
          customer_product_params[:dispatchgroup_id]
      end
      unless customer_product_params[:quotation_id].nil?
        body_t['quotation_id'] =
          customer_product_params[:quotation_id]
      end

      req.body = body_t
      puts req
    end
    JSON.parse(response.body)
  end

  def self.get_create_customer_products_additional_api(customer_product_additional_params)
    response = api_connection.post do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/api/v1/customer_t.json'
      else
        req.url('/api/v1/customers/' + customer_product_additional_params[:customer_id] + '/create_product_additional')
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      body_t = {}
      body_t['customer_id'] = customer_product_additional_params[:customer_id]
      body_t['business_unit'] = customer_product_additional_params[:business_unit]
      body_t['family'] = customer_product_additional_params[:family]
      body_t['subfamily'] = customer_product_additional_params[:subfamily]
      body_t['product_name'] = customer_product_additional_params[:product_name]
      unless customer_product_additional_params[:quantity].nil?
        body_t['quantity'] =
          customer_product_additional_params[:quantity]
      end

      req.body = body_t
      puts req
    end
    JSON.parse(response.body)
  end

  def self.get_customer_products_api(id)
    response = api_connection.get do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/customer_products_t.json'
      else
        req.url('/api/v1/customers/' + id.to_s + '/products')
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  def self.get_update_customer_products_api(customer_product_update_params, params)
    response = api_connection.patch do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/api/v1/customer_t.json'
      else
        req.url('/api/v1/customers/' + customer_product_update_params[:customer_id] + '/update_product')
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      body_t = {}
      unless customer_product_update_params[:customer_product_id].nil?
        body_t['customer_product_id'] =
          customer_product_update_params[:customer_product_id]
      end
      body_t['id'] = customer_product_update_params[:id] unless customer_product_update_params[:id].nil?
      body_t['tnr'] = customer_product_update_params[:tnr] unless customer_product_update_params[:tnr].nil?
      unless customer_product_update_params[:customer_id].nil?
        body_t['customer_id'] =
          customer_product_update_params[:customer_id]
      end
      unless customer_product_update_params[:business_unit].nil?
        body_t['business_unit'] =
          customer_product_update_params[:business_unit]
      end
      body_t['family'] = customer_product_update_params[:family] unless customer_product_update_params[:family].nil?
      unless customer_product_update_params[:subfamily].nil?
        body_t['subfamily'] =
          customer_product_update_params[:subfamily]
      end
      unless customer_product_update_params[:specific].nil?
        body_t['specific'] =
          customer_product_update_params[:specific]
      end
      unless customer_product_update_params[:product_name].nil?
        body_t['product_name'] =
          customer_product_update_params[:product_name]
      end
      unless customer_product_update_params[:discontinued].nil?
        body_t['discontinued'] =
          customer_product_update_params[:discontinued]
      end
      unless customer_product_update_params[:instalation_date].nil?
        body_t['instalation_date'] =
          customer_product_update_params[:instalation_date]
      end
      unless customer_product_update_params[:technical_diagnosis].nil?
        body_t['technical_diagnosis'] =
          customer_product_update_params[:technical_diagnosis]
      end
      unless customer_product_update_params[:expert_opinion].nil?
        body_t['expert_opinion'] =
          customer_product_update_params[:expert_opinion]
      end
      unless customer_product_update_params[:activity_performed].nil?
        body_t['activity_performed'] =
          customer_product_update_params[:activity_performed]
      end
      unless customer_product_update_params[:warranty].nil?
        body_t['warranty'] =
          customer_product_update_params[:warranty]
      end
      body_t['status'] = customer_product_update_params[:status] unless customer_product_update_params[:status].nil?
      unless customer_product_update_params[:visit_id].nil?
        body_t['visit_id'] =
          customer_product_update_params[:visit_id]
      end
      body_t['images'] = params[:images] unless params[:images].nil?
      unless customer_product_update_params[:dispatchgroup_id].nil?
        body_t['dispatchgroup_id'] =
          customer_product_update_params[:dispatchgroup_id]
      end
      unless customer_product_update_params[:quotation_id].nil?
        body_t['quotation_id'] =
          customer_product_update_params[:quotation_id]
      end

      unless params[:unit_real_state_id].nil?
        body_t['unit_real_state_id'] =
          params[:unit_real_state_id]
      end

      unless params[:unit_real_state_number].nil?
        body_t['unit_real_state_number'] =
          params[:unit_real_state_number]
      end

      req.body = body_t
      puts req
    end
    JSON.parse(response.body)
  end

  def self.destroy_customer_customer_product_api(customer_id, customer_product_id)
    response = api_connection.delete do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/api/v1/customer_t.json'
      else
        req.url("/api/v1/customers/#{customer_id}/customer_product/#{customer_product_id}")
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  def self.get_service_spare_parts(service_spare_part_params)
    response = api_connection.get do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/customer_t.json'
      else
        req.url("/api/v1/services/#{service_spare_part_params[:id]}/spare_parts")
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  def self.get_service_requested_spare_parts(service_spare_part_params)
    response = api_connection.get do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/customer_t.json'
      else
        req.url("/api/v1/services/#{service_spare_part_params[:id]}/requested_spare_parts")
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  def self.get_service_selected_spare_parts(service_spare_part_params)
    response = api_connection.get do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/customer_t.json'
      else
        req.url("/api/v1/services/#{service_spare_part_params[:id]}/selected_spare_parts")
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  def self.get_create_service_spare_parts_api(service_spare_part_params)
    response = api_connection.post do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/api/v1/customer_t.json'
      else
        req.url("/api/v1/services/#{service_spare_part_params[:id]}/create_spare_part")
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      body_t = {}
      body_t['products'] = service_spare_part_params[:products] unless service_spare_part_params[:products].nil?
      req.body = body_t
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  def self.get_update_service_spare_parts_api(service_spare_part_params)
    response = api_connection.patch do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/api/v1/customer_t.json'
      else
        req.url("/api/v1/services/#{service_spare_part_params[:id]}/spare_parts/#{service_spare_part_params[:service_spare_part_id]}")
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      body_t = {}
      body_t['quantity'] = service_spare_part_params[:quantity] unless service_spare_part_params[:quantity].nil?
      unless service_spare_part_params[:requested_quantity].nil?
        body_t['requested_quantity'] =
          service_spare_part_params[:requested_quantity]
      end
      body_t['status'] = service_spare_part_params[:status] unless service_spare_part_params[:status].nil?
      unless service_spare_part_params[:delivery_status].nil?
        body_t['delivery_status'] =
          service_spare_part_params[:delivery_status]
      end
      body_t['background'] = service_spare_part_params[:background] unless service_spare_part_params[:background].nil?

      req.body = body_t
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  def self.get_assign_spare_parts_api(service_spare_part_params)
    response = api_connection.post do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/api/v1/customer_t.json'
      else
        req.url("/api/v1/services/#{service_spare_part_params[:id]}/assign_spare_parts")
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      body_t = {}
      unless service_spare_part_params[:service_spare_part_ids].nil?
        body_t['service_spare_part_ids'] =
          service_spare_part_params[:service_spare_part_ids]
      end
      unless service_spare_part_params[:technician_id].nil?
        body_t['technician_id'] =
          service_spare_part_params[:technician_id]
      end
      req.body = body_t
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  def self.reintegrated_spare_parts_api(technician_id)
    response = api_connection.get do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/api/v1/customer_t.json'
      else
        req.url("/api/v1/services_technician_reintegrated_spare_parts/#{technician_id}")
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      body_t = {}
      req.body = body_t
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  def self.get_technician_service_products_api(service_spare_part_params)
    response = api_connection.get do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/api/v1/customer_t.json'
      else
        req.url("/api/v1/services/#{service_spare_part_params[:id]}/technician_spare_parts/#{service_spare_part_params[:technician_id]}")
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  def self.get_technician_all_service_products_api(service_spare_part_params)
    response = api_connection.get do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/api/v1/customer_t.json'
      else
        req.url("/api/v1/services_technician_all_spare_parts/#{service_spare_part_params[:technician_id]}")
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  def self.get_technician_all_service_used_products_api(service_spare_part_params)
    response = api_connection.get do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/api/v1/customer_t.json'
      else
        req.url("/api/v1/services_technician_all_used_spare_parts/#{service_spare_part_params[:technician_id]}")
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  def self.destroy_service_spare_part_api(id, service_spare_part_id)
    response = api_connection.delete do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/api/v1/customer_t.json'
      else
        req.url("/api/v1/services/#{id}/spare_parts/#{service_spare_part_id}")
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  def self.get_customer_products_assign_product_spare_parts(customer_products_service_spare_parts_params)
    response = api_connection.post do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/api/v1/customer_t.json'
      else
        req.url("/api/v1/customer_products/#{customer_products_service_spare_parts_params[:id]}/assign_spare_parts")
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      body_t = {}
      unless customer_products_service_spare_parts_params[:service_spare_part_ids].nil?
        body_t['service_spare_part_ids'] =
          customer_products_service_spare_parts_params[:service_spare_part_ids]
      end
      unless customer_products_service_spare_parts_params[:quantities].nil?
        body_t['quantities'] =
          customer_products_service_spare_parts_params[:quantities]
      end
      unless customer_products_service_spare_parts_params[:warranties].nil?
        body_t['warranties'] =
          customer_products_service_spare_parts_params[:warranties]
      end
      unless customer_products_service_spare_parts_params[:visit_id].nil?
        body_t['visit_id'] =
          customer_products_service_spare_parts_params[:visit_id]
      end

      req.body = body_t
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  def self.get_customer_products_reintegrate_product_spare_parts(customer_products_service_spare_parts_params)
    response = api_connection.post do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/api/v1/customer_t.json'
      else
        req.url("/api/v1/customer_products/#{customer_products_service_spare_parts_params[:id]}/reintegrate_product_spare_parts")
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      body_t = {}
      unless customer_products_service_spare_parts_params[:customer_product_service_spare_part_ids].nil?
        body_t['customer_product_service_spare_part_ids'] =
          customer_products_service_spare_parts_params[:customer_product_service_spare_part_ids]
      end
      unless customer_products_service_spare_parts_params[:quantities].nil?
        body_t['quantities'] =
          customer_products_service_spare_parts_params[:quantities]
      end
      unless customer_products_service_spare_parts_params[:technician_id].nil?
        body_t['technician_id'] =
          customer_products_service_spare_parts_params[:technician_id]
      end

      req.body = body_t
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  def self.get_customer_products_product_spare_parts(customer_products_service_spare_parts_params)
    response = api_connection.get do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/api/v1/customer_t.json'
      else
        req.url("/api/v1/customer_products/#{customer_products_service_spare_parts_params[:id]}/customer_product_used_spare_parts?service_id=#{customer_products_service_spare_parts_params[:service_id]}&visit_id=#{customer_products_service_spare_parts_params[:visit_id]}")
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      body_t = {}
      req.body = body_t
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  def self.get_customer_products_product_requested_spare_parts(customer_products_service_spare_parts_params)
    response = api_connection.get do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/api/v1/customer_t.json'
      else
        req.url("/api/v1/customer_products/#{customer_products_service_spare_parts_params[:customer_product_id]}/customer_product_requested_spare_parts?visit_id=#{customer_products_service_spare_parts_params[:visit_id]}")
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"

      body_t = {}
      req.body = body_t
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  def self.get_customer_products_getCheckStates(params)
    response = api_connection.get do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/api/v1/customer_t.json'
      else
        req.url("/api/v1/customer_products/getCheckStates?customer_product_ids=#{params[:customer_product_ids]}&visit_id=#{params[:visit_id]}")
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  ####################################################################
  # CUSTOMER POLICIES
  ###################################################################
  def self.get_create_customer_policy_api(customer_policy_params)
    response = api_connection.post do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/api/v1/policy_t.json'
      else
        req.url('/api/v1/customers/' + customer_policy_params[:customer_id] + '/create_policy')
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      body_t = {}
      body_t['customer_id'] = customer_policy_params[:customer_id]
      body_t['customer_products_id'] = customer_policy_params[:customer_products_id]
      body_t['address_assinged'] = customer_policy_params[:address_assinged]
      body_t['labor_price'] = customer_policy_params[:labor_price]
      body_t['items_price'] = customer_policy_params[:items_price]
      body_t['viatic_price'] = customer_policy_params[:viatic_price]
      body_t['iva_amount'] = customer_policy_params[:iva_amount]
      body_t['subtotal_price'] = customer_policy_params[:subtotal_price]
      body_t['total_price'] = customer_policy_params[:total_price]
      req.body = body_t
      puts req
    end
    JSON.parse(response.body)
  end

  def self.get_update_customer_policy_api(customer_policy_params)
    response = api_connection.patch do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/api/v1/policy_t.json'
      else
        req.url('/api/v1/customers/' + customer_policy_params[:customer_id] + '/policies/' + customer_policy_params[:policy_id] + '/update_policy')
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      body_t = {}
      body_t['policy_id'] = customer_policy_params[:policy_id]
      body_t['customer_id'] = customer_policy_params[:customer_id]
      body_t['customer_products_id'] = customer_policy_params[:customer_products_id]
      body_t['address_assinged'] = customer_policy_params[:address_assinged]
      body_t['labor_price'] = customer_policy_params[:labor_price]
      body_t['items_price'] = customer_policy_params[:items_price]
      body_t['viatic_price'] = customer_policy_params[:viatic_price]
      body_t['iva_amount'] = customer_policy_params[:iva_amount]
      body_t['subtotal_price'] = customer_policy_params[:subtotal_price]
      body_t['total_price'] = customer_policy_params[:total_price]
      req.body = body_t
      puts req
    end
    JSON.parse(response.body)
  end

  def self.get_customer_policy_api(customer_policy_params)
    response = api_connection.get do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/policy_t.json'
      else
        req.url('/api/v1/customers/' + customer_policy_params[:customer_id] + '/policies/' + customer_policy_params[:policy_id])
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  def self.get_destroy_customer_policy_api(customer_policy_params)
    response = api_connection.delete do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/api/v1/policy_t.json'
      else
        req.url('/api/v1/customers/' + customer_policy_params[:customer_id] + '/policies/' + customer_policy_params[:policy_id])
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  def self.get_validate_policy_payment_api(customer_policy_params)
    response = api_connection.post do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/api/v1/policy_t.json'
      else
        req.url('/api/v1/customers/' + customer_policy_params[:customer_id] + '/policies/' + customer_policy_params[:policy_id] + '/validate_payment')
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      body_t = {}
      unless customer_policy_params[:payment_files].nil?
        body_t['payment_files'] =
          customer_policy_params[:payment_files]
      end

      req.body = body_t
      puts req
    end
    JSON.parse(response.body)
  end

  ####################################################################
  # CUSTOMER SERVICES
  ###################################################################
  def self.get_create_customer_service_api(service_params)
    response = api_connection.post do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/api/v1/customer_t.json'
      else
        req.url('/api/v1/customers/' + service_params[:customer_id] + '/create_service')
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60

      cost_center_id = service_params[:cost_center_id].to_i.zero? ? nil : service_params[:cost_center_id].to_i
      body_t = {}
      body_t['customer_id'] = service_params[:customer_id] unless service_params[:customer_id].nil?
      body_t['service_id'] = service_params[:service_id] unless service_params[:service_id].nil?
      body_t['address'] = service_params[:address] unless service_params[:address].nil?
      body_t['address_fn'] = service_params[:address_fn] unless service_params[:address_fn].nil?
      body_t['service_type'] = service_params[:service_type] unless service_params[:service_type].nil?
      body_t['subcategory'] = service_params[:subcategory] unless service_params[:subcategory].nil?
      body_t['requested'] = service_params[:requested] unless service_params[:requested].nil?
      body_t['request_channel'] = service_params[:request_channel] unless service_params[:request_channel].nil?
      body_t['distributor_name'] = service_params[:distributor_name] unless service_params[:distributor_name].nil?
      body_t['distributor_email'] = service_params[:distributor_email] unless service_params[:distributor_email].nil?
      unless service_params[:customer_products_id].nil?
        body_t['customer_products_id'] =
          service_params[:customer_products_id]
      end
      unless service_params[:technicians_number].nil?
        body_t['technicians_number'] =
          service_params[:technicians_number]
      end
      body_t['hour_amount'] = service_params[:hour_amount] unless service_params[:hour_amount].nil?
      body_t['labor_amount'] = service_params[:labor_amount] unless service_params[:labor_amount].nil?
      body_t['viatic_amount'] = service_params[:viatic_amount] unless service_params[:viatic_amount].nil?

      body_t['subtotal_amount'] = service_params[:subtotal_amount] unless service_params[:subtotal_amount].nil?
      body_t['iva_amount'] = service_params[:iva_amount] unless service_params[:iva_amount].nil?
      body_t['fee_amount'] = service_params[:fee_amount] unless service_params[:fee_amount].nil?
      body_t['total_hours'] = service_params[:total_hours] unless service_params[:total_hours].nil?
      body_t['total_amount'] = service_params[:total_amount] unless service_params[:total_amount].nil?
      body_t['status'] = service_params[:status] unless service_params[:status].nil?
      body_t['background'] = service_params[:background] unless service_params[:background].nil?
      body_t['no_payment'] = service_params[:no_payment] unless service_params[:no_payment].nil?
      body_t['payment_channel'] = service_params[:payment_channel] unless service_params[:payment_channel].nil?
      body_t['payment_date'] = service_params[:payment_date] unless service_params[:payment_date].nil?
      body_t['no_payment_reason'] = service_params[:no_payment_reason] unless service_params[:no_payment_reason].nil?
      body_t['invoice'] = service_params[:invoice] unless service_params[:invoice].nil?
      body_t['event_start'] = service_params[:event_start] unless service_params[:event_start].nil?
      body_t['event_end'] = service_params[:event_end] unless service_params[:event_end].nil?
      body_t['technicians_ids'] = service_params[:technicians_ids] unless service_params[:technicians_ids].nil?
      body_t['images'] = service_params[:images] unless service_params[:images].nil?
      body_t['payment_state'] = service_params[:payment_state] unless service_params[:payment_state].nil?
      body_t['consumables'] = service_params[:consumables] unless service_params[:consumables].nil?
      unless service_params[:customer_payment_date].nil?
        body_t['customer_payment_date'] =
          service_params[:customer_payment_date]
      end
      body_t['from'] = service_params[:from] unless service_params[:from].nil?
      body_t['policy_id'] = service_params[:policy_id] unless service_params[:policy_id].nil?
      body_t['cost_center_id'] = cost_center_id

      req.body = body_t
      puts req
    end
    JSON.parse(response.body)
  end

  def self.get_update_customer_service_api(service_params)
    response = api_connection.patch do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/api/v1/customer_t.json'
      else
        req.url('/api/v1/customers/' + service_params[:customer_id] + '/services/' + service_params[:service_id] + '/update_service')
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      body_t = {}
      body_t['notification'] = service_params[:notification] unless service_params[:notification].nil?
      body_t['customer_id'] = service_params[:customer_id] unless service_params[:customer_id].nil?
      body_t['service_id'] = service_params[:service_id] unless service_params[:service_id].nil?
      body_t['address'] = service_params[:address] unless service_params[:address].nil?
      body_t['address_fn'] = service_params[:address_fn] unless service_params[:address_fn].nil?
      body_t['service_type'] = service_params[:service_type] unless service_params[:service_type].nil?
      body_t['subcategory'] = service_params[:subcategory] unless service_params[:subcategory].nil?
      body_t['requested'] = service_params[:requested] unless service_params[:requested].nil?
      body_t['request_channel'] = service_params[:request_channel] unless service_params[:request_channel].nil?
      body_t['distributor_name'] = service_params[:distributor_name] unless service_params[:distributor_name].nil?
      body_t['distributor_email'] = service_params[:distributor_email] unless service_params[:distributor_email].nil?
      unless service_params[:customer_products_id].nil?
        body_t['customer_products_id'] =
          service_params[:customer_products_id]
      end
      unless service_params[:technicians_number].nil?
        body_t['technicians_number'] =
          service_params[:technicians_number]
      end
      body_t['hour_amount'] = service_params[:hour_amount] unless service_params[:hour_amount].nil?
      body_t['labor_amount'] = service_params[:labor_amount] unless service_params[:labor_amount].nil?
      body_t['viatic_amount'] = service_params[:viatic_amount] unless service_params[:viatic_amount].nil?
      body_t['subtotal_amount'] = service_params[:subtotal_amount] unless service_params[:subtotal_amount].nil?
      body_t['iva_amount'] = service_params[:iva_amount] unless service_params[:iva_amount].nil?
      body_t['fee_amount'] = service_params[:fee_amount] unless service_params[:fee_amount].nil?
      body_t['total_hours'] = service_params[:total_hours] unless service_params[:total_hours].nil?
      body_t['total_amount'] = service_params[:total_amount] unless service_params[:total_amount].nil?
      body_t['status'] = service_params[:status] unless service_params[:status].nil?
      body_t['background'] = service_params[:background] unless service_params[:background].nil?
      body_t['no_payment'] = service_params[:no_payment] unless service_params[:no_payment].nil?
      body_t['payment_channel'] = service_params[:payment_channel] unless service_params[:payment_channel].nil?
      body_t['payment_date'] = service_params[:payment_date] unless service_params[:payment_date].nil?
      body_t['no_payment_reason'] = service_params[:no_payment_reason] unless service_params[:no_payment_reason].nil?
      body_t['invoice'] = service_params[:invoice] unless service_params[:invoice].nil?
      body_t['event_start'] = service_params[:event_start] unless service_params[:event_start].nil?
      body_t['event_end'] = service_params[:event_end] unless service_params[:event_end].nil?
      body_t['technicians_ids'] = service_params[:technicians_ids] unless service_params[:technicians_ids].nil?
      body_t['images'] = service_params[:images] unless service_params[:images].nil?
      body_t['payment_state'] = service_params[:payment_state] unless service_params[:payment_state].nil?
      body_t['consumables'] = service_params[:consumables] unless service_params[:consumables].nil?
      unless service_params[:customer_payment_date].nil?
        body_t['customer_payment_date'] =
          service_params[:customer_payment_date]
      end
      body_t['ibs_number'] = service_params[:ibs_number] unless service_params[:ibs_number].nil?
      unless service_params[:spare_part_delivery_date].nil?
        body_t['spare_part_delivery_date'] =
          service_params[:spare_part_delivery_date]
      end
      unless service_params[:principal_technician].nil?
        body_t['principal_technician'] =
          service_params[:principal_technician]
      end
      if ActiveRecord::Type::Boolean.new.cast(service_params[:do_cancel_service])
        unless service_params[:do_cancel_service].nil?
          body_t['do_cancel_service'] =
            service_params[:do_cancel_service]
        end
        unless service_params[:background_cancel_service].nil?
          body_t['background_cancel_service'] =
            service_params[:background_cancel_service]
        end
        body_t['cancel_reason'] = service_params[:cancel_reason] unless service_params[:cancel_reason].nil?
      end
      body_t['payment_files'] = service_params[:payment_files] unless service_params[:payment_files].nil?
      unless service_params[:requested_spare_parts_ids].nil?
        body_t['requested_spare_parts_ids'] =
          service_params[:requested_spare_parts_ids]
      end
      body_t['validated_payment'] = service_params[:validated_payment] unless service_params[:validated_payment].nil?
      body_t['from'] = service_params[:from] unless service_params[:from].nil?
      body_t['policy_id'] = service_params[:policy_id] unless service_params[:policy_id].nil?
      unless service_params[:background_prediagnosis].nil?
        body_t['background_prediagnosis'] =
          service_params[:background_prediagnosis]
      end
      body_t['submit_type'] = service_params[:submit_type] unless service_params[:submit_type].nil?

      req.body = body_t
      puts req
    end
    JSON.parse(response.body)
  end

  def self.filter_options
    response = api_connection.get do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/services_t.json'
      else
        req.url('/api/v1/services/filter_options')
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  ####################################################################
  # CUSTOMER COMPLATAINS
  ###################################################################

  def self.customer_complaints_api(id)
    response = api_connection.get do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/services_t.json'
      else
        req.url("/api/v1/customers/#{id}/complaints")
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  def self.create_customer_complaint_api(customer_complaints_params)
    response = api_connection.post do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/api/v1/customer_t.json'
      else
        req.url("/api/v1/customers/#{customer_complaints_params[:id]}/create_complaint")
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      body_t = {}
      unless customer_complaints_params[:complaint_id].nil?
        body_t['complaint_id'] =
          customer_complaints_params[:complaint_id]
      end
      unless customer_complaints_params[:service_id].nil?
        body_t['service_id'] =
          customer_complaints_params[:service_id]
      end
      unless customer_complaints_params[:complaint_type].nil?
        body_t['complaint_type'] =
          customer_complaints_params[:complaint_type]
      end
      body_t['channel'] = customer_complaints_params[:channel] unless customer_complaints_params[:channel].nil?
      body_t['phone'] = customer_complaints_params[:phone] unless customer_complaints_params[:phone].nil?
      unless customer_complaints_params[:complaint_background].nil?
        body_t['complaint_background'] =
          customer_complaints_params[:complaint_background]
      end
      unless customer_complaints_params[:compensation_proposal].nil?
        body_t['compensation_proposal'] =
          customer_complaints_params[:compensation_proposal]
      end
      unless customer_complaints_params[:closure_details].nil?
        body_t['closure_details'] =
          customer_complaints_params[:closure_details]
      end
      unless customer_complaints_params[:compensation_proposal_2].nil?
        body_t['compensation_proposal_2'] =
          customer_complaints_params[:compensation_proposal_2]
      end
      unless customer_complaints_params[:closure_details_2].nil?
        body_t['closure_details_2'] =
          customer_complaints_params[:closure_details_2]
      end
      body_t['stage'] = customer_complaints_params[:stage] unless customer_complaints_params[:stage].nil?

      req.body = body_t
      puts req
    end
    JSON.parse(response.body)
  end

  def self.assign_unit_real_state(params)
    response = api_connection.patch do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/api/v1/customer_t.json'
      else
        req.url("/api/v1/customers/#{params[:id]}/assign_unit_real_state/#{params[:unit_real_state_id]}")
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  def self.customer_unit_real_states(params)
    response = api_connection.get do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/api/v1/customer_t.json'
      else
        req.url("/api/v1/customers/#{params[:id]}/unit_real_states")
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  def self.update_customer_complaint_api(customer_complaints_params)
    response = api_connection.patch do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/api/v1/customer_t.json'
      else
        req.url("/api/v1/customers/#{customer_complaints_params[:id]}/update_complaint")
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      body_t = {}
      unless customer_complaints_params[:complaint_id].nil?
        body_t['complaint_id'] =
          customer_complaints_params[:complaint_id]
      end
      unless customer_complaints_params[:service_id].nil?
        body_t['service_id'] =
          customer_complaints_params[:service_id]
      end
      unless customer_complaints_params[:complaint_type].nil?
        body_t['complaint_type'] =
          customer_complaints_params[:complaint_type]
      end
      body_t['channel'] = customer_complaints_params[:channel] unless customer_complaints_params[:channel].nil?
      body_t['phone'] = customer_complaints_params[:phone] unless customer_complaints_params[:phone].nil?
      unless customer_complaints_params[:complaint_background].nil?
        body_t['complaint_background'] =
          customer_complaints_params[:complaint_background]
      end
      unless customer_complaints_params[:compensation_proposal].nil?
        body_t['compensation_proposal'] =
          customer_complaints_params[:compensation_proposal]
      end
      unless customer_complaints_params[:closure_details].nil?
        body_t['closure_details'] =
          customer_complaints_params[:closure_details]
      end
      unless customer_complaints_params[:compensation_proposal_2].nil?
        body_t['compensation_proposal_2'] =
          customer_complaints_params[:compensation_proposal_2]
      end
      unless customer_complaints_params[:closure_details_2].nil?
        body_t['closure_details_2'] =
          customer_complaints_params[:closure_details_2]
      end
      body_t['stage'] = customer_complaints_params[:stage] unless customer_complaints_params[:stage].nil?

      req.body = body_t
      puts req
    end
    JSON.parse(response.body)
  end

  ####################################################################
  # Products
  ###################################################################
  def self.get_products_api(page = '1', per_page = '10', filterText = '', spare_parts = nil, countries = nil)
    response = api_connection.get do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/products_t.json'
      else
        req.url('/api/v1/products?page=' + page.to_s + '&per_page=' + per_page.to_s + '&keywords=' + filterText)
      end
      req.params['spare_parts'] = spare_parts unless spare_parts.nil?
      req.params['countries'] = countries unless countries.nil?
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  def self.get_products_by_tnr_api(tnrs = '', countries = nil)
    response = api_connection.get do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/products_t.json'
      else
        req.url('/api/v1/products_by_tnr?tnrs=' + tnrs.to_s)
      end
      req.params['countries'] = countries unless countries.nil?
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  ####################################################################
  # Taxons
  ###################################################################
  def self.taxons_api(taxonomy_name = '', country = 'MX', taxon_ids = nil)
    response = api_connection.get do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/taxons_t.json'
      else
        req.url('/api/v1/taxons?keywords=' + taxonomy_name + '&country=' + country + '&taxon_ids=' + taxon_ids.to_s)
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  def self.taxon_names_api(taxon_ids = nil)
    response = api_connection.get do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/taxons_t.json'
      else
        req.url('/api/v1/taxon_names?taxon_ids=' + taxon_ids.to_s)
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  ####################################################################
  # Unique IDS USER
  ###################################################################

  def self.user_unique_ids_api(filterText = 'tickets')
    response = api_connection.get do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/user_unique_ids_t.json'
      else
        req.url('/api/v1/user_unique_ids?keywords=' + filterText)
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  ####################################################################
  # Cost center user
  ###################################################################

  def self.cost_centers_api
    response = api_connection.get do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/cost_centers_t.json'
      else
        req.url('/api/v1/cost_centers')
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  ####################################################################
  # Administrative demarcations
  ###################################################################

  def self.administrative_demarcations_api(country_code = 'CL', zipcode = '')
    response = api_connection.get do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/administrative_demarcations_t.json'
      else
        req.url('/api/v1/administrative_demarcations?keywords=' + country_code + '&zipcode=' + zipcode.to_s)
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  ####################################################################
  # Services
  ###################################################################
  def self.services_api(page = '1', per_page = '5', customer_id = '', country = '', keywords = '', only_payed = false, start_date = '', finish_date = '', query_params)
    response = api_connection.get do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/services_t.json'
      else
        req.url('/api/v1/services?page=' + page.to_s + '&per_page=' + per_page.to_s + '&customer_id=' + customer_id + '&country=' + country + '&keywords=' + keywords + '&only_payed=' + only_payed.to_s + '&start_date=' + start_date + '&finish_date=' + finish_date)
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.params = query_params
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  def self.services_with_extended_info_api(customer_id = '', country = '', keywords = '', only_payed = false, start_date = '', finish_date = '')
    response = api_connection.get do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/services_t.json'
      else
        req.url('/api/v1/services_with_extended_info?customer_id=' + customer_id + '&country=' + country + '&keywords=' + keywords + '&only_payed=' + only_payed.to_s + '&start_date=' + start_date + '&finish_date=' + finish_date)
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 300
      puts req
    end
    JSON.parse(response.body)
  end

  def self.services_technician_api(page = '1', per_page = '10', technician_id = '')
    response = api_connection.get do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/services_t.json'
      else
        req.url('/api/v1/services/' + technician_id + '/technician?page=' + page.to_s + '&per_page=' + per_page.to_s)
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  def self.service_api(service_params)
    response = api_connection.get do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/services_t.json'
      else
        req.url('/api/v1/services/' + service_params[:id])
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  def self.service_status_changes_api(service_params)
    response = api_connection.get do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/services_t.json'
      else
        req.url("/api/v1/services/#{service_params[:id]}/status_changes")
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  def self.service_status_label_api(service_params)
    response = api_connection.get do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/services_t.json'
      else
        req.url("/api/v1/services/#{service_params[:id]}/status_label")
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  def self.service_total_price_api(service_params, extra_params)
    response = api_connection.get do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/services_t.json'
      else
        req.url("/api/v1/services/#{service_params[:id]}/total_price")
      end

      req.params = {
        service_type: service_params[:service_type],
        subcategory: service_params[:subcategory],
        products_ids: service_params[:products_ids],
        zipcode: service_params[:zipcode],
        administrative_demarcation_name: service_params[:administrative_demarcation_name],
        country: service_params[:country],
        time_diff: service_params[:time_diff] || ''
      }.merge(extra_params)
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  def self.get_update_service_visit_api(visit_params)
    response = api_connection.patch do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/api/v1/customer_t.json'
      else
        req.url("/api/v1/services/#{visit_params[:id]}/visits/#{visit_params[:visit_id]}/update_visit")
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      body_t = {}
      body_t['technicians_ids'] = visit_params[:technicians_ids] unless visit_params[:technicians_ids].nil?
      body_t['event_start'] = visit_params[:event_start] unless visit_params[:event_start].nil?
      body_t['event_end'] = visit_params[:event_end] unless visit_params[:event_end].nil?
      body_t['confirmed'] = visit_params[:confirmed] unless visit_params[:confirmed].nil?
      body_t['status'] = visit_params[:status] unless visit_params[:status].nil?
      body_t['signature'] = visit_params[:signature] unless visit_params[:signature].nil?
      body_t['person_accountable'] = visit_params[:person_accountable] unless visit_params[:person_accountable].nil?
      body_t['payment_files'] = visit_params[:payment_files] unless visit_params[:payment_files].nil?

      req.body = body_t
      puts req
    end
    JSON.parse(response.body)
  end

  def self.get_project_customer_api(rfc)
    response = api_connection.get do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/project_customer_t.json'
      else
        req.url('/api/v1/project_customers/no_id?rfc=' + rfc.to_s)
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  def self.invoiced_visits(visit_ids)
    response = api_connection.post do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/api/v1/customer_t.json'
      else
        req.url('/api/v1/visits/invoiced_visits')
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"

      req.options.timeout = 60
      body_t = {}
      body_t['visit_ids'] = visit_ids
      req.body = body_t
      puts req
    end
    response.status
  end

  def self.services_customer_complaints_api(id)
    response = api_connection.get do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/services_t.json'
      else
        req.url("/api/v1/services/#{id}/customer_complaints")
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  ####################################################################
  # Visits
  ###################################################################

  def self.get_visit_api(visits_params)
    response = api_connection.get do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/service_with_data_t.json'
      else
        req.url('/api/v1/visits/' + visits_params[:id])
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  def self.get_create_customer_visit_api(create_visit_params)
    response = api_connection.post do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/api/v1/customer_t.json'
      else
        req.url('/api/v1/services/' + create_visit_params[:service_id] + '/visits')
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      body_t = {}
      body_t['customer_id'] = create_visit_params[:customer_id] unless create_visit_params[:customer_id].nil?
      body_t['service_id'] = create_visit_params[:service_id] unless create_visit_params[:service_id].nil?
      body_t['visit_id'] = create_visit_params[:visit_id] unless create_visit_params[:visit_id].nil?
      body_t['address'] = create_visit_params[:address] unless create_visit_params[:address].nil?
      body_t['address_fn'] = create_visit_params[:address_fn] unless create_visit_params[:address_fn].nil?
      body_t['service_type'] = create_visit_params[:service_type] unless create_visit_params[:service_type].nil?
      body_t['subcategory'] = create_visit_params[:subcategory] unless create_visit_params[:subcategory].nil?
      body_t['requested'] = create_visit_params[:requested] unless create_visit_params[:requested].nil?
      body_t['assigned_quotation_id'] = create_visit_params[:assigned_quotation_id] unless create_visit_params[:assigned_quotation_id].nil?
      unless create_visit_params[:request_channel].nil?
        body_t['request_channel'] =
          create_visit_params[:request_channel]
      end
      unless create_visit_params[:distributor_name].nil?
        body_t['distributor_name'] =
          create_visit_params[:distributor_name]
      end
      unless create_visit_params[:distributor_email].nil?
        body_t['distributor_email'] =
          create_visit_params[:distributor_email]
      end
      unless create_visit_params[:customer_products_id].nil?
        body_t['customer_products_id'] =
          create_visit_params[:customer_products_id]
      end
      unless create_visit_params[:technicians_number].nil?
        body_t['technicians_number'] =
          create_visit_params[:technicians_number]
      end
      body_t['hour_amount'] = create_visit_params[:hour_amount] unless create_visit_params[:hour_amount].nil?
      body_t['fee_amount'] = create_visit_params[:fee_amount] unless create_visit_params[:fee_amount].nil?
      body_t['labor_amount'] = create_visit_params[:labor_amount] unless create_visit_params[:labor_amount].nil?
      body_t['viatic_amount'] = create_visit_params[:viatic_amount] unless create_visit_params[:viatic_amount].nil?
      unless create_visit_params[:subtotal_amount].nil?
        body_t['subtotal_amount'] =
          create_visit_params[:subtotal_amount]
      end
      body_t['iva_amount'] = create_visit_params[:iva_amount] unless create_visit_params[:iva_amount].nil?
      body_t['total_hours'] = create_visit_params[:total_hours] unless create_visit_params[:total_hours].nil?
      body_t['total_amount'] = create_visit_params[:total_amount] unless create_visit_params[:total_amount].nil?

      body_t['status'] = create_visit_params[:status] unless create_visit_params[:status].nil?
      body_t['background'] = create_visit_params[:background] unless create_visit_params[:background].nil?
      body_t['no_payment'] = create_visit_params[:no_payment] unless create_visit_params[:no_payment].nil?
      unless create_visit_params[:payment_channel].nil?
        body_t['payment_channel'] =
          create_visit_params[:payment_channel]
      end
      body_t['payment_date'] = create_visit_params[:payment_date] unless create_visit_params[:payment_date].nil?
      unless create_visit_params[:no_payment_reason].nil?
        body_t['no_payment_reason'] =
          create_visit_params[:no_payment_reason]
      end
      body_t['invoice'] = create_visit_params[:invoice] unless create_visit_params[:invoice].nil?
      body_t['event_start'] = create_visit_params[:event_start] unless create_visit_params[:event_start].nil?
      body_t['event_end'] = create_visit_params[:event_end] unless create_visit_params[:event_end].nil?
      unless create_visit_params[:technicians_ids].nil?
        body_t['technicians_ids'] =
          create_visit_params[:technicians_ids]
      end
      body_t['images'] = create_visit_params[:images] unless create_visit_params[:images].nil?
      body_t['payment_state'] = create_visit_params[:payment_state] unless create_visit_params[:payment_state].nil?
      body_t['consumables'] = create_visit_params[:consumables] unless create_visit_params[:consumables].nil?
      unless create_visit_params[:customer_payment_date].nil?
        body_t['customer_payment_date'] =
          create_visit_params[:customer_payment_date]
      end
      body_t['from'] = create_visit_params[:from] unless create_visit_params[:from].nil?
      body_t['policy_id'] = create_visit_params[:policy_id] unless create_visit_params[:policy_id].nil?

      req.body = body_t
      puts req
    end
    JSON.parse(response.body)
  end

  def self.get_update_visit_api(update_visits_params)
    response = api_connection.patch do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/api/v1/customer_t.json'
      else
        req.url('/api/v1/visits/' + update_visits_params[:id])
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      body_t = {}
      unless update_visits_params[:payment_channel].nil?
        body_t['payment_channel'] =
          update_visits_params[:payment_channel]
      end
      body_t['payment_date'] = update_visits_params[:payment_date] unless update_visits_params[:payment_date].nil?
      unless update_visits_params[:customer_payment_date].nil?
        body_t['customer_payment_date'] =
          update_visits_params[:customer_payment_date]
      end
      body_t['payment_files'] = update_visits_params[:payment_files] unless update_visits_params[:payment_files].nil?
      unless update_visits_params[:new_amounts].nil?
        body_t['new_amounts'] =
          JSON.parse(update_visits_params[:new_amounts])
      end
      req.body = body_t
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  def self.get_cancel_service_visit_api(visit_params)
    response = api_connection.post do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/api/v1/customer_t.json'
      else
        req.url("/api/v1/services/#{visit_params[:id]}/visits/#{visit_params[:visit_id]}/cancel_visit")
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"

      req.options.timeout = 60
      body_t = {}
      body_t['cancel_from'] = visit_params[:cancel_from] unless visit_params[:cancel_from].nil?
      body_t['cancel_reason'] = visit_params[:cancel_reason] unless visit_params[:cancel_reason].nil?
      req.body = body_t
      puts req
    end
    JSON.parse(response.body)
  end

  def self.get_start_visit_api(visits_params)
    response = api_connection.post do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/api/v1/customer_t.json'
      else
        req.url('/api/v1/visits/' + visits_params[:id] + '/start')
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  def self.get_finish_visit_api(visits_params)
    response = api_connection.post do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/api/v1/customer_t.json'
      else
        req.url('/api/v1/visits/' + visits_params[:id] + '/finish')
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  def self.get_arrival_visit_api(visits_params)
    response = api_connection.post do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/api/v1/customer_t.json'
      else
        req.url('/api/v1/visits/' + visits_params[:id] + '/arrival')
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  def self.get_assign_visit_spare_parts_api(visit_spare_part_params)
    response = api_connection.post do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/api/v1/customer_t.json'
      else
        req.url("/api/v1/visits/#{visit_spare_part_params[:id]}/assign_spare_parts")
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      body_t = {}
      unless visit_spare_part_params[:visit_spare_part_id].nil?
        body_t['visit_spare_part_id'] =
          visit_spare_part_params[:visit_spare_part_id]
      end
      unless visit_spare_part_params[:technician_id].nil?
        body_t['technician_id'] =
          visit_spare_part_params[:technician_id]
      end
      body_t['quantity'] = visit_spare_part_params[:quantity] unless visit_spare_part_params[:quantity].nil?
      req.body = body_t
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  def self.get_received_visit_spare_parts_api(visit_spare_part_params)
    response = api_connection.post do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/api/v1/customer_t.json'
      else
        req.url("/api/v1/visits/#{visit_spare_part_params[:id]}/received_spare_parts")
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      body_t = {}
      unless visit_spare_part_params[:visit_spare_part_ids].nil?
        body_t['visit_spare_part_ids'] =
          visit_spare_part_params[:visit_spare_part_ids]
      end
      unless visit_spare_part_params[:technician_id].nil?
        body_t['technician_id'] =
          visit_spare_part_params[:technician_id]
      end
      req.body = body_t
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  def self.get_technician_visit_products_api(visit_spare_part_params)
    response = api_connection.get do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/api/v1/customer_t.json'
      else
        req.url("/api/v1/visits/#{visit_spare_part_params[:id]}/technician_spare_parts/#{visit_spare_part_params[:technician_id]}")
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  def self.get_technician_visit_all_products_api(visit_spare_part_params)
    response = api_connection.get do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/api/v1/customer_t.json'
      else
        req.url("/api/v1/technician_all_spare_parts/#{visit_spare_part_params[:technician_id]}")
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  def self.get_request_spare_parts_visit_api(request_spare_parts_params)
    response = api_connection.post do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/api/v1/customer_t.json'
      else
        req.url("/api/v1/visits/#{request_spare_parts_params[:id]}/request_spare_parts")
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      body_t = {}
      body_t['products'] = request_spare_parts_params[:products] unless request_spare_parts_params[:products].nil?
      unless request_spare_parts_params[:customer_product_id].nil?
        body_t['customer_product_id'] =
          request_spare_parts_params[:customer_product_id]
      end
      unless request_spare_parts_params[:quantities].nil?
        body_t['quantities'] =
          request_spare_parts_params[:quantities]
      end
      unless request_spare_parts_params[:warranties].nil?
        body_t['warranties'] =
          request_spare_parts_params[:warranties]
      end
      req.body = body_t
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  def self.get_requested_visit_spare_parts_api(request_spare_parts_params)
    response = api_connection.get do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/api/v1/customer_t.json'
      else
        req.url("/api/v1/visits/#{request_spare_parts_params[:id]}/requested_spare_parts")
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  ####################################################################
  # Quotations
  ###################################################################

  def self.get_quotation_api(quotations_params)
    response = api_connection.get do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/quotation_t.json'
      else
        req.url('/api/v1/quotations/' + quotations_params[:id])
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 120
      puts req
    end
    JSON.parse(response.body)
  end

  def self.get_update_quotation_api(quotations_params, person_accountable = nil)
    response = api_connection.patch do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/api/v1/customer_t.json'
      else
        req.url('/api/v1/quotations/' + quotations_params[:id])
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      body_t = {}
      body_t['save_type'] = quotations_params[:save_type] unless quotations_params[:save_type].nil?
      body_t['tm_background'] = quotations_params[:tm_background] unless quotations_params[:tm_background].nil?
      body_t['cs_background'] = quotations_params[:cs_background] unless quotations_params[:cs_background].nil?
      unless quotations_params[:customer_background].nil?
        body_t['customer_background'] =
          quotations_params[:customer_background]
      end
      unless quotations_params[:customer_product_warranties].nil?
        body_t['customer_product_warranties'] =
          quotations_params[:customer_product_warranties]
      end
      unless quotations_params[:spare_parts_amount].nil?
        body_t['spare_parts_amount'] =
          quotations_params[:spare_parts_amount]
      end
      body_t['labor_amount'] = quotations_params[:labor_amount] unless quotations_params[:labor_amount].nil?
      body_t['viatic_amount'] = quotations_params[:viatic_amount] unless quotations_params[:viatic_amount].nil?
      body_t['subtotal_amount'] = quotations_params[:subtotal_amount] unless quotations_params[:subtotal_amount].nil?
      body_t['iva_amount'] = quotations_params[:iva_amount] unless quotations_params[:iva_amount].nil?
      body_t['total_amount'] = quotations_params[:total_amount] unless quotations_params[:total_amount].nil?
      body_t['person_accountable'] = person_accountable unless person_accountable.nil?

      req.body = body_t
      req.options.timeout = 300
      puts req
    end
    JSON.parse(response.body)
  end

  def self.get_validate_payment_quotation_api(quotations_params)
    response = api_connection.patch do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/api/v1/customer_t.json'
      else
        req.url('/api/v1/quotations/' + quotations_params[:id] + '/validate_payment')
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      body_t = {}
      body_t['payment_date'] = quotations_params[:payment_date] unless quotations_params[:payment_date].nil?
      unless quotations_params[:customer_payment_date].nil?
        body_t['customer_payment_date'] =
          quotations_params[:customer_payment_date]
      end
      body_t['payment_channel'] = quotations_params[:payment_channel] unless quotations_params[:payment_channel].nil?
      req.body = body_t
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  def self.get_create_quotation_spare_parts_api(service_spare_part_params)
    response = api_connection.post do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/api/v1/customer_t.json'
      else
        req.url("/api/v1/quotations/#{service_spare_part_params[:id]}/create_spare_part")
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      body_t = {}
      body_t['products'] = service_spare_part_params[:products] unless service_spare_part_params[:products].nil?
      unless service_spare_part_params[:customer_product_id].nil?
        body_t['customer_product_id'] =
          service_spare_part_params[:customer_product_id]
      end
      body_t['status'] = service_spare_part_params[:status] unless service_spare_part_params[:status].nil?
      req.body = body_t
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  def self.get_update_quotation_spare_parts_api(quotation_spare_part_params)
    response = api_connection.patch do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/api/v1/customer_t.json'
      else
        req.url("/api/v1/quotations/#{quotation_spare_part_params[:id]}/spare_parts/#{quotation_spare_part_params[:quotation_spare_part_id]}")
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      body_t = {}
      body_t['quantity'] = quotation_spare_part_params[:quantity] unless quotation_spare_part_params[:quantity].nil?
      body_t['from'] = quotation_spare_part_params[:from] unless quotation_spare_part_params[:from].nil?
      unless quotation_spare_part_params[:requested_quantity].nil?
        body_t['requested_quantity'] =
          quotation_spare_part_params[:requested_quantity]
      end
      body_t['status'] = quotation_spare_part_params[:status] unless quotation_spare_part_params[:status].nil?
      body_t['warranty'] = quotation_spare_part_params[:warranty] unless quotation_spare_part_params[:warranty].nil?
      body_t['price'] = quotation_spare_part_params[:price] unless quotation_spare_part_params[:price].nil?

      req.body = body_t
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  def self.destroy_quotation_spare_part_api(id, quotation_spare_part_id, from = '')
    response = api_connection.delete do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/api/v1/customer_t.json'
      else
        req.url("/api/v1/quotations/#{id}/spare_parts/#{quotation_spare_part_id}?from=#{from}")
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  ####################################################################
  # Calendar Events
  ###################################################################

  def self.colors
    response = api_connection.get do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/technician_calendar_events_t.json'
      else
        req.url('/api/v1/calendar_events/colors')
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  def self.calendar_events_api(country_code = 'CL', all = '0')
    response = api_connection.get do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/technician_calendar_events_t.json'
      else
        req.url('/api/v1/calendar_events?country=' + country_code.to_s + '&all=' + all.to_s)
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  def self.technician_calendar_events_api(technician_id, calendar_start_date = nil, calendar_finish_date = nil)
    response = api_connection.get do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/technician_calendar_events_t.json'
      else
        req.url("/api/v1/technician_calendar_events?technician_id=#{technician_id}&calendar_start_date=#{calendar_start_date}&calendar_finish_date=#{calendar_finish_date}")
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  def self.technician_work_load_api(technician_id)
    response = api_connection.get do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/technician_calendar_events_t.json'
      else
        req.url('/api/v1/technician_work_load?technician_id=' + technician_id)
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  def self.create_technician_events_api(technician_id, technician_country, new_events)
    response = api_connection.post do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/customer_t.json'
      else
        req.url('/api/v1/technician_calendar_events')
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      body_t = {}
      body_t['technician_id'] = technician_id
      body_t['technician_country'] = technician_country
      body_t['new_events'] = new_events
      req.body = body_t
      puts req
    end
    # return JSON.parse(response.body)
  end

  def self.destroy_technician_calendar_events(start_date, finish_date, technician_id)
    response = api_connection.delete do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/api/v1/customer_t.json'
      else
        req.url('/api/v1/destroy_technician_calendar_events/')
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      body_t = {}
      body_t['start_date'] = start_date
      body_t['finish_date'] = finish_date
      body_t['technician_id'] = technician_id
      req.body = body_t
      puts req
    end
  end

  ####################################################################
  # Viatic values
  ###################################################################

  def self.viatic_values_api(country, zone)
    response = api_connection.get do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/viatic_values_t.json'
      else
        req.url("/api/v1/viatic_values?country=#{country}&zone=#{zone}")
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  ####################################################################
  # Labor Prices
  ###################################################################

  def self.labor_prices_api(country, units)
    response = api_connection.get do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/labor_prices_t.json'
      else
        req.url("/api/v1/labor_prices?country=#{country}&units=#{units}")
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  ####################################################################
  # Service Prices
  ###################################################################

  def self.service_prices_api(country, products_ids, service_type)
    response = api_connection.get do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/service_prices_t.json'
      else
        req.url("/api/v1/service_prices?country=#{country}&products_ids=#{products_ids}&service_type=#{service_type}")
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  ####################################################################
  # Resource Files
  ###################################################################

  def self.file_resources_api(id)
    response = api_connection.get do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/customer_t.json'
      else
        req.url("/api/v1/file_resources/#{id}/visit_customer_products")
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  def self.check_list_file_resources_api(id)
    response = api_connection.get do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/customer_t.json'
      else
        req.url("/api/v1/file_resources/#{id}/checklist_product_images")
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  def self.destroy_file_resource_api(id)
    response = api_connection.delete do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/api/v1/customer_t.json'
      else
        req.url('/api/v1/file_resources/' + id.to_s)
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      body_t = {}
      body_t['id'] = id
      req.body = body_t
      puts req
    end
    JSON.parse(response.body)
  end

  ####################################################################
  # Consumables
  ###################################################################
  def self.consumables_api(params)
    response = api_connection.get do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/consumables_t.json'
      else
        req.url("/api/v1/consumables?products_ids=#{params[:products_ids]}&country=#{params[:country]}")
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  ####################################################################
  # Checklists
  ###################################################################
  def self.checklists_api(_params)
    response = api_connection.get do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/consumables_t.json'
      else
        req.url('/api/v1/checklists')
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  def self.customer_product_checklists_api(params)
    response = api_connection.get do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/consumables_t.json'
      else
        req.url("/api/v1/customer_product_checklists?customer_product_id=#{params[:customer_product_id]}")
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  def self.customer_product_get_checklists_answers_api(customer_product_checklist_params)
    response = api_connection.get do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/consumables_t.json'
      else
        req.url("/api/v1/customer_product_checklists/#{customer_product_checklist_params[:customer_product_id]}/get_answers")
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  def self.customer_product_checklists_answers_api(customer_product_checklist_params, params)
    response = api_connection.post do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/api/v1/customer_t.json'
      else
        req.url("/api/v1/customer_product_checklists/#{customer_product_checklist_params[:customer_product_id]}/answers")
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      body_t = {}
      unless customer_product_checklist_params[:answers].nil?
        body_t['answers'] =
          JSON.parse(customer_product_checklist_params[:answers].to_json)
      end
      unless customer_product_checklist_params[:preVisit].nil?
        body_t['preVisit'] =
          customer_product_checklist_params[:preVisit]
      end
      unless customer_product_checklist_params[:status].nil?
        body_t['status'] =
          customer_product_checklist_params[:status]
      end
      body_t['images'] = params[:images] unless params[:images].nil?

      req.body = body_t
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  ####################################################################
  # Surveys
  ###################################################################

  def self.survey_questions_api
    response = api_connection.get do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/user_unique_ids_t.json'
      else
        req.url('/api/v1/survey_questions')
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  def self.get_survey_answers_api(survey_questions_params)
    response = api_connection.post do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/api/v1/customer_t.json'
      else
        req.url('/api/v1/survey_questions/answer')
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      body_t = {}
      unless survey_questions_params[:service_id].nil?
        body_t['service_id'] =
          JSON.parse(survey_questions_params[:service_id].to_json)
      end
      unless survey_questions_params[:survey_id].nil?
        body_t['survey_id'] =
          JSON.parse(survey_questions_params[:survey_id].to_json)
      end
      unless survey_questions_params[:answers].nil?
        body_t['answers'] =
          JSON.parse(survey_questions_params[:answers].to_json)
      end
      unless survey_questions_params[:status].nil?
        body_t['status'] =
          JSON.parse(survey_questions_params[:status].to_json)
      end
      unless survey_questions_params[:background].nil?
        body_t['background'] =
          JSON.parse(survey_questions_params[:background].to_json)
      end

      req.body = body_t
      req.options.timeout = 60
      puts req
    end
    JSON.parse(response.body)
  end

  def self.send_payment_email(service_id)
    service_params_service = {}
    service_params_service[:id] = service_id.to_s
    @service = ApiSingleton.service_api(service_params_service)
    # customer = ApiSingleton.get_customer_api(@service["customer_id"])
    # service_params_visit = {}
    # service_params_visit[:id] = @service["last_visit"]["id"].to_s
    # @visit = ApiSingleton.get_visit_api(service_params_visit)["data"]
    @customer_visit = ApiSingleton.get_visit_api({ id: @service['last_visit']['id'].to_s })
    emails = 'cristian@garagelabs.cl'
    begin
      NotificationMailer.payment_email(emails, @customer_visit['data']['service_id'].to_s, 'visit',
                                       @customer_visit['data']['id'].to_s).deliver_now
    # NotificationMailer.visit_report_email(emails, @service["id"].to_s, @visit["id"].to_s).deliver_now
    rescue StandardError
      puts 'No se ha podido enviar el email.'
    end
  end

  def self.update_push_notification_token(customer_id, token)
    response = api_connection.patch do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/services_t.json'
      else
        req.url("/api/v1/customers/#{customer_id}")
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      body_t = {}
      body_t['push_notification_token'] = token

      req.body = body_t
      puts req
    end
    JSON.parse(response.body)
  end

  def self.create_push_notification(params)
    return if params.blank?

    response = api_connection.post do |req|
      if Rails.env.test?
        req.url 'http://localhost:3000/services_t.json'
      else
        req.url('/api/v1/push_notifications')
      end
      req.headers['Authorization'] = "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}"
      req.options.timeout = 60
      body_t = {}
      body_t['title'] = params[:message][:title]
      body_t['body'] = params[:message][:body]
      body_t['data'] = params[:data].to_json
      body_t['token'] = params[:token]
      body_t['customer_id'] = params[:customer_id]

      req.body = body_t
      puts req
    end
    JSON.parse(response.body)
  end

  def self.connect_to_api
    Faraday.new(url_api) do |c|
      c.use Faraday::Request::UrlEncoded
      c.use Faraday::Adapter::NetHttp
    end
  end

  def self.url_api
    return URL_API if @@current_locale.nil?

    url = URI.parse(URL_API)
    url.host = "#{@@current_locale}.#{url.host}"
    url.to_s
  end

  def self.api_connection
    connect_to_api
  end
end

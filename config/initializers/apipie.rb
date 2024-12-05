Apipie.configure do |config|
  config.app_name                = "Miele Tickets"
  config.app_info                = "API para apps de clientes y técnicos de Miele Tickets"
  config.api_base_url            = ""
  config.doc_base_url            = "/docs/api"
  # where is your API defined?
  config.api_controllers_matcher = "#{Rails.root}/app/controllers/api/**/*.rb"
  config.languages               = ["es"]
  config.default_locale          = "es"
end

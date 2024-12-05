source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '2.7.1'

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '~> 6.0.2', '>= 6.0.2.2'
# Use sqlite3 as the database for Active Record
gem 'pg'
# Use Puma as the app server
gem 'puma', '~> 6.3'
# Use SCSS for stylesheets
gem 'sass-rails', '>= 6'
# Transpile app-like JavaScript. Read more: https://github.com/rails/webpacker
gem 'webpacker', '~> 4.0'
# Turbolinks makes navigating your web application faster. Read more: https://github.com/turbolinks/turbolinks
gem 'turbolinks', '~> 5'
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.7'
# Use Redis adapter to run Action Cable in production
# gem 'redis', '~> 4.0'
# Use Active Model has_secure_password
# gem 'bcrypt', '~> 3.1.7'
# Use Active Storage variant
# gem 'image_processing', '~> 1.2'

# Monitoring
gem "sentry-ruby"
gem "sentry-rails"

# Reduces boot times through caching; required in config/boot.rb
gem 'bootsnap', '>= 1.4.2', require: false
gem 'awesome_print'
#gem 'letter_opener', group: :development
gem  'premailer-rails' #para el css de los correos.

gem 'googleauth'

#Email

gem 'mandrill-api', require:'mandrill'


group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'pry-byebug', '~> 3.7.0'
end

group :development do
  # Access an interactive console on exception pages or by calling 'console' anywhere in the code.
  gem 'capistrano3-puma', github: 'seuros/capistrano-puma'
  gem 'web-console', '>= 3.3.0'
  gem 'listen', '>= 3.0.5', '< 3.2'
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]

gem "react-rails", "~> 2.6"

# Authorization
gem 'devise'
gem 'cancancan'
## Para preveer ataques DDOS
gem 'rack-attack'
# Paginación
gem 'will_paginate', '~> 3.1.0'

# API PIE
gem 'apipie-rails'
gem 'rack-cors'


# Procesamiento paralelo
gem 'sidekiq'

# Capistrano para despliegue de aplicación en servidor remoto
gem 'capistrano', '~> 3.0'
gem 'capistrano-rvm'
gem 'capistrano-bundler', '1.1.1'
gem 'capistrano-rails', '1.1.3'
gem 'capistrano-sidekiq', github: 'seuros/capistrano-sidekiq'
gem 'net-ssh'
gem 'net-scp'
gem 'sshkit'
gem 'airbrussh'
gem 'coderay'
gem 'city-state'

##############################################
# Para detección de errores y envio de correos
gem 'exception_notification'
gem 'faraday_middleware', '~> 0.14.0'
gem 'faraday_middleware-aws-signers-v4'
##############################################
#Integración webpay
gem 'signer', '~> 1.4.2'
gem 'savon', '~> 2.11.1'

#Gema para leer y escribir archivos Excel y CSV
gem 'roo'
##############################################
# Gema par descargar excel
gem 'caxlsx'
gem 'caxlsx_rails'



##############################################
# PDF Generador
gem 'wicked_pdf'
# HTML to PDF
gem 'wkhtmltopdf-binary' 
##############################################
## Gema de amazon para hacer conexión con S3 en la subida de imágenes
gem 'aws-sdk', '~> 3'
gem 'aws-sdk-s3'
gem 'psych', '~> 3.3.1'
group :production do
  ##############################################
  ## Gema para la sincronización de los assets con amazon
  gem 'fog-aws'
  gem 'asset_sync'
  gem "lograge"
end

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
  
  # Variables de entorno en development
  gem 'dotenv-rails'

  # Testing
  gem 'rspec-rails', '~> 3.8'
  gem 'capybara'
  gem 'rspec-json_expectations'
  gem 'shoulda-matchers', '~> 3.1'
  gem 'factory_bot_rails'
  gem 'selenium-webdriver'
  gem 'database_cleaner'
  gem "webmock"
  gem 'rack_session_access'
  gem 'capybara-screenshot', :group => :test
  # Análisis estático para detección de vulnerabilidades de seguridad (fuente: https://github.com/presidentbeef/brakeman)
  gem 'brakeman', require: false

  # Análisis de cobertura de test
  gem 'simplecov', require: false

  # Code quality reporter
  gem "rubycritic", require: false

  # Trigger Rubycritic each a time file is saved
  gem "guard-rubycritic", require: false
  
  #Time travel and time freezing gem
  gem 'timecop'

  #faker data
  gem 'faker'
  gem 'webdrivers', '~> 4.0', require: false
end
gem "noticed", "~> 1.4"

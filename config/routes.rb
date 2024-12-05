Rails.application.routes.draw do
  apipie
  devise_for :users, controllers: {
    passwords: 'users/passwords'
  }
  devise_scope :user do
    root to: 'devise/sessions#new'
    get 'login', to: 'devise/sessions#new', as: :login
    delete 'logout', to: 'devise/sessions#destroy', as: :logout
    get 'thanks', to: 'users/passwords#thanks', as: :thanks
  end


  require 'sidekiq/web'
  authenticate :user, lambda { |u| u.admin? } do
    mount Sidekiq::Web => '/sidekiq'
  end
  # resources :users
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  get '/home', to: 'home#index', as: :home
  get '/denied', to: 'home#denied', as: :denied
  #################################################################################

  #################################################################################
  ## Payments

  #################################################################################
  get '/payments', to: 'payments#index', as: :payments
  get '/payments/:id/thanks', to: 'payments#thanks', as: :payments_thanks

  #################################################################################
  ## Juno
  resources :juno, only: %i[index] do
    defaults format: :json do
      collection do
        post 'payment_notification'
      end
    end
  end

  ## Cielo
  resources :cielo, only: %i[index] do
    defaults format: :json do
      collection do
        post 'payment_notification'
      end
    end
  end

  ## WebPay Gateway
  get 'webpay', to: 'webpay#pay', as: :webpay
  # The return URL for confirm transaction
  post 'webpay/confirmation', to: 'webpay#confirmation', as: :webpay_confirmation
  # The success URL
  get 'webpay/success', to: 'webpay#success',  as:  :webpay_success
  get 'webpay/failure', to: 'webpay#failure',  as:  :webpay_failure
  #################################################################################

  #################################################################################
  ## MasterCard Gateway
  get 'mastercard_lightbox/:provider/:object_id', to: 'mastercard#mastercard_lightbox'
  get 'mastercard_script/:provider', to: 'mastercard#load_mastercard_script'
  get 'mastercard/cancelCallback', to: 'mastercard#cancelCallback'
  get 'mastercard/errorCallback', to: 'mastercard#errorCallback'
  get 'mastercard/completeCallback', to: 'mastercard#completeCallback'
  #################################################################################
  # Data Download
  get '/download_zipcodes', to: 'data_download#download_zipcodes', as: :download_zipcodes

  #################################################################################
  # Services
  ################################################################################
  get 'services/:id/report_pdf', to: 'services#report_pdf', as: :report_pdf

  #################################################################################
  # Quotations
  ################################################################################
  get 'quotations/:id/show', to: 'quotations#show', as: :quotation_pdf

  # API ROUTES
  namespace :api do
    namespace :v1, defaults: { format: :json } do
      resources :countries, only: %i[index]
      # AUTHENTICATION
      devise_scope :user do
        post 'sign_in', to: 'sessions#create'
        post 'password', to: 'passwords#create'
      end

      # ABILITY
      get 'abilities/check', to: 'abilities#check'

      # USERS
      get 'users', to: 'users#index'
      get 'users/:id', to: 'users#show'
      get 'users/:id/notifications', to: 'users#notifications'
      get 'users/:id/notifications/:notification_id/read', to: 'users#notification_read'
      get 'users/:id/notifications_unread', to: 'users#notifications_unread'

      get 'users/:id/edit', to: 'users#edit'
      post 'users/:id/to_disable', to: 'users#to_disable'
      
      post 'users', to: 'users#create'
      patch 'users/:id', to: 'users#update'
      delete 'users/:id', to: 'users#destroy'
      get 'user_unique_ids', to: 'users#user_unique_ids'
      get 'cost_centers', to: 'users#cost_centers'

      # Technicians
    	get 'technicians', to: "technicians#index"
      get 'technicians/:id/reintegrated_spare_parts', to: "technicians#reintegrated_spare_parts"
      get 'get_technicians', to: "technicians#get_technicians"
      get 'get_technicians_by_taxon', to: "technicians#get_technicians_by_taxon"
      get 'technicians/:id', to: "technicians#show"
      get 'technicians/:id/edit', to: "technicians#edit"
      get 'all_technicians', to: "technicians#all_technicians"
      post 'technicians', to: "technicians#create"
      patch 'technicians/:id', to: "technicians#update"
      delete 'technicians/:id', to: "technicians#destroy"

      resources :projects, only: %w[show]
      # Project Customer
      get 'project_customers', to: 'customers#project_customers_index'
      # Customers
      put 'customers/:id/assign_unit_real_state/:unit_real_state_id', to: 'customers#assign_unit_real_state'
      get 'customers/:id/unit_real_states', to: 'customers#unit_real_states'
      get 'customers', to: 'customers#index'
      get 'customers/:id', to: 'customers#show'
      get 'customers/:id/edit', to: 'customers#edit'
      get 'customers/:id/products', to: 'customers#products'
      post 'customers', to: 'customers#create'
      post 'customersAdditional', to: 'customers#createAdditional'
      patch 'customers/:id', to: 'customers#update'
      patch 'customersAdditional/:id', to: 'customers#updateAdditional'
      delete 'customers/:id', to: 'customers#destroy'
      delete 'customersAdditional/:id', to: 'customers#destroyAdditional'

      post 'customers/:customer_id/create_product', to: 'customers#create_product'
      patch 'customers/:customer_id/update_product', to: 'customers#update_product'
      post 'customers/:customer_id/create_product_additional', to: 'customers#create_product_additional'
      delete 'customers/:customer_id/customer_product/:customer_product_id', to: 'customers#delete_product'
      post 'customer_products/:id/assign_spare_parts', to: 'customers#assign_product_spare_parts'
      post 'customer_products/:id/reintegrate_product_spare_parts', to: 'customers#reintegrate_product_spare_parts'
      get 'customer_products/:id/customer_product_used_spare_parts', to: 'customers#customer_product_used_spare_parts'
      get 'customer_products/:customer_product_id/customer_product_requested_spare_parts',
          to: 'customers#customer_product_requested_spare_parts'
      get 'customer_products/getCheckStates', to: 'customers#getCheckStates'
      post 'customers/get_quotations', to: 'customers#get_quotations'

      # Customer Policies
      post 'customers/:customer_id/create_policy', to: 'customers#create_policy'
      patch 'customers/:customer_id/policies/:policy_id/update_policy', to: 'customers#update_policy'
      post 'customers/:customer_id/create_service', to: 'customers#create_service'
      patch 'customers/:customer_id/services/:service_id/update_service', to: 'customers#update_service'
      get 'customers/:customer_id/policies/:policy_id', to: 'customers#show_policy'
      delete 'customers/:customer_id/policies/:policy_id', to: 'customers#destroy_policy'
      post 'customers/:customer_id/policies/:policy_id/validate_payment', to: 'customers#validate_policy_payment'

      # Customer Complaints
      get 'customers/:id/complaints', to: 'customers#complaints'
      post 'customers/:id/create_complaint', to: 'customers#create_complaint'
      patch 'customers/:id/update_complaint', to: 'customers#update_complaint'

      # Visits
      get 'visits/:id', to: 'visits#show'
      get 'visits/:id/technicians', to: 'visits#technicians'

      resources :visits, only: [] do
        collection do
          post :invoiced_visits
        end
      end

      patch 'visits/:id', to: 'visits#update'
      post 'visits/:id/start', to: 'visits#start_visit'
      post 'visits/:id/finish', to: 'visits#finish_visit'
      post 'visits/:id/arrival', to: 'visits#arrival_visit'
      post 'visits/:id/received_spare_parts', to: 'visits#received_spare_parts'
      post 'visits/:id/assign_spare_parts', to: 'visits#assign_spare_parts'
      get 'visits/:id/technician_spare_parts/:technician_id', to: 'visits#technician_spare_parts'
      get 'technician_all_spare_parts/:technician_id', to: 'visits#technician_all_spare_parts'
      post 'visits/:id/request_spare_parts', to: 'visits#request_spare_parts'
      get 'visits/:id/requested_spare_parts', to: 'visits#requested_spare_parts'

      # Quotations
      get 'quotations/:id', to: 'quotations#show'
      patch 'quotations/:id', to: 'quotations#update'
      patch 'quotations/:id/validate_payment', to: 'quotations#validate_payment'
      post 'quotations/:id/create_spare_part', to: 'quotations#create_spare_part'
      patch 'quotations/:id/spare_parts/:quotation_spare_part_id', to: 'quotations#update_spare_part'
      delete 'quotations/:id/spare_parts/:quotation_spare_part_id', to: 'quotations#delete_spare_parts'

      # Additional Address
      post 'customersAdditionalAddress', to: 'customers#createAdditionalAddress'
      patch 'customersAdditionalAddress/:id', to: 'customers#updateAdditionalAddress'
      delete 'customersAdditionalAddress/:id', to: 'customers#destroyAdditionalAddress'

      # Taxons
      get 'taxons', to: 'taxons#index'
      get 'taxon_names', to: 'taxons#index_names'

      # Country Administrative demarcations
      get 'administrative_demarcations', to: 'administrative_demarcations#index'

      # Products
      get 'products', to: 'products#index'
      get 'products_by_tnr', to: 'products#index_by_tnr'

      # Services
      get 'services', to: 'services#index'
      resources :services, only: [] do
        collection do
          get :filter_options
        end
      end
      get 'services/:technician_id/technician', to: 'services#index_by_techinician'
      get 'services/:id', to: 'services#show'
      get 'services/:id/status_changes', to: 'services#status_changes'

      get 'services/:id/status_label', to: 'services#status_label'
      get 'services/:id/total_price', to: 'services#total_price'
      get 'services/:id/spare_parts', to: 'services#spare_parts'
      get 'services/:id/requested_spare_parts', to: 'services#requested_spare_parts'
      get 'services/:id/selected_spare_parts', to: 'services#selected_spare_parts'
      post 'services/:id/create_spare_part', to: 'services#create_spare_part'
      post 'services/:id/assign_spare_parts', to: 'services#assign_spare_parts'
      get 'services/:id/technician_spare_parts/:technician_id', to: 'services#technician_spare_parts'
      get 'services_technician_all_spare_parts/:technician_id', to: 'services#technician_all_spare_parts'
      get 'services_technician_all_used_spare_parts/:technician_id', to: 'services#technician_all_used_spare_parts'

      patch 'services/:id/spare_parts/:service_spare_part_id', to: 'services#update_spare_part'
      delete 'services/:id/spare_parts/:service_spare_part_id', to: 'services#delete_spare_parts'
      get 'services/:id/customer_complaints', to: 'services#customer_complaints'
      get 'services_report_excel', to: 'services#services_report_excel'

      # Service Visits
      post 'services/:id/visits', to: 'services#create_visit'
      patch 'services/:id/visits/:visit_id/update_visit', to: 'services#update_visit'
      post 'services/:id/visits/:visit_id/cancel_visit', to: 'services#cancel_visit'

      # Calendar Events
      get 'calendar_events', to: "calendar_events#index"
      get 'technician_calendar_events', to: "calendar_events#index_technician_calendar_events"
      post 'calendar_events', to: "calendar_events#create"
      post 'calendar_events/destroy_event', to: "calendar_events#destroy"

      resources :calendar_events, only: [] do
        collection do
          get :colors
        end
      end
      
      # Viatic values
      get 'viatic_values', to: 'viatic_values#index'

      # Labor Prices
      get 'labor_prices', to: 'labor_prices#index'

      # Service Prices
      get 'service_prices', to: 'service_prices#index'

      # Payments
      get 'payments', to: 'payments#index'
      post 'payments/save_data', to: 'payments#save_payment_data'

      # Payments methods
      get 'payment_methods', to: 'payment_methods#index'

      # File Resources
      delete 'file_resources/:id', to: 'file_resources#destroy'
      get 'file_resources/:id/visit_customer_products', to: 'file_resources#visit_product_images'
      get 'file_resources/:id/checklist_product_images', to: 'file_resources#checklist_product_images'

      # Consumabless
      get 'consumables', to: 'consumables#index'

      # Cchecklists
      get 'checklists', to: 'checklists#index'
      get 'customer_product_checklists', to: 'checklists#customer_product_checklists'
      get 'customer_product_checklists/:customer_product_id/get_answers', to: 'checklists#get_answers'
      post 'customer_product_checklists/:customer_product_id/answers', to: 'checklists#answers'

      # Surveys
      get 'survey_questions', to: 'survey_questions#index'
      post 'survey_questions/answer', to: 'survey_questions#answer'


      # Technicians
    	get 'downloads', to: "data_download#index"

      # MOCK
      patch '/customer_t.json', to: 'customers#mock_customer'
      post '/customer_t.json', to: 'customers#mock_customer'
      get '/customer_t.json', to: 'customers#mock_customer'
      delete '/customer_t.json', to: 'customers#mock_customer'
      post '/policy_t.json', to: 'customers#mock_policy'
      patch '/policy_t.json', to: 'customers#mock_policy'
      delete '/policy_t.json', to: 'customers#mock_policy'
    end
  end

  get '*page', to: 'home#index', constraints: lambda { |req|
    !req.xhr? && req.format.html?
  }
end

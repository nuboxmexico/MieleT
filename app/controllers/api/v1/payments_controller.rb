class Api::V1::PaymentsController < ApplicationController
    protect_from_forgery with: :null_session, only: [:index, :save_payment_data]
    skip_before_action :authenticate_user!, only: [:index, :save_payment_data]
    include ActionController::HttpAuthentication::Token::ControllerMethods
    before_action :authenticate, only: [:index, :save_payment_data]
	
    api :GET, "/v1/payments", "Lista todos pagos asociados a un objeto"
    param :object_id, String, :desc => "ID del objecto del pago asociado."
    param :object_class, String, :desc => "Tipo del objecto asociado. (Servicio, Póliza, etc)."
    example "Request: "+Rails.application.config.site_url+"/api/v1/payments?object_id=1&object_class=Servicio\n
    Salida:
    {
        data: [
            {
                id: 1,
                user_id: 1,
                customer_id: '1',
                object_id: '1',
                object_class: 'Servicio',
                amount: 48,
                status: 'completed',
                token_ws: 'voizio12ijdnpoawa',
                provider_params: '{... some provider params}',
                transaction_id: 'voizio12ijdnpoawa',
                created_at: '2020-10-29T14:28:28.342-06:00',
                updated_at: '2020-10-29T14:28:48.762-06:00',
                number: 'PM001',
                payment_method_id: 1
            }
        ]
    }
    "
    def index
        response = {}
        payments = Payment.where(object_id: params[:object_id], object_class: params[:object_class]).order(id: :desc)
        if params[:object_class] == "Visita" && payments.size < 1
            payments = Payment.where(object_id: params[:service_id], object_class: "Servicio").order(id: :desc)
        end

        #TODO: Posibilidad de agregar sidekiq-scheduler y eliminar los pagos en estado "pending" durante la madrugada con un worker.
        response["data"] = payments.reject{ |payment| payment.status == "pending"}
        render json:  response.to_json
	end

    
    api :POST, "/v1/payments/save_data", "Actualiza los datos de un Pago"
    param :object_id, String, :desc => "ID del objecto del pago asociado."
    param :object_class, String, :desc => "Tipo del objecto asociado. (Servicio, Póliza, etc)."
    param :customer_id, String, :desc => "ID del cliente el cual esta asociado el pago"
    param :amount, String, :desc => "Monto del pago"
    param :provider_id, String, :desc => "ID del método de pago"
    example "Request: "+Rails.application.config.site_url+"/api/v1/payments/save_data\n
    Salida:
    {
        data: [
            {
                id: 1,
                user_id: 1,
                customer_id: '1',
                object_id: '1',
                object_class: 'Servicio',
                amount: 48,
                status: 'completed',
                token_ws: 'voizio12ijdnpoawa',
                provider_params: '{... some provider params}',
                transaction_id: 'voizio12ijdnpoawa',
                created_at: '2020-10-29T14:28:28.342-06:00',
                updated_at: '2020-10-29T14:28:48.762-06:00',
                number: 'PM001',
                payment_method_id: 1
            }
        ]
    }
    "
    def save_payment_data
        @payment = Payment.find_or_create_by(object_id: params[:object_id], user_id: current_user.id, customer_id: params[:customer_id], amount: params[:customer_id], object_class: params[:object_class])
        
        @payment.update(
          amount: params[:amount],
          payment_method_id: params[:provider_id],
          status: 'completed'
        )
        payment_data = {
          result_indicator: params[:result_indicator], 
          session_version: params[:session_version]
        }

        if @payment.update(provider_params: payment_data, transaction_id: params[:result_indicator])
            render json: @payment.to_json
        else
            render json: @payment.errors.full_messages, status: :bad_request
        end
        
    end
end

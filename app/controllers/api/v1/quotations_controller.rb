class Api::V1::QuotationsController < ApplicationController
  protect_from_forgery with: :null_session,
                       only: %i[show update create_spare_part update_spare_part
                                delete_spare_parts validate_payment]
  skip_before_action :authenticate_user!,
                     only: %i[show update create_spare_part update_spare_part delete_spare_parts validate_payment]
  include ActionController::HttpAuthentication::Token::ControllerMethods
  before_action :authenticate,
                only: %i[show update create_spare_part update_spare_part delete_spare_parts validate_payment]

  api :GET, '/v1/quotations/:id', 'Lista una cotizacion'
  param :id, String, desc: 'ID de la cotizacion a consultar'
  def show
    quotation = ApiSingleton.get_quotation_api(quotations_params)
    render json: quotation.to_json
  end

  api :PATCH, '/v1/quotations/:id', 'Actualiza una cotizacion para un cliente en miele'
  param :id, String, desc: 'ID de la cotizacion a actualizar'
  param :service_id, String, desc: 'ID del servicio asociado a la cotización en cuestión'
  param :save_type, String, desc: "Tipo de actualización para la cotizacion. Enviar 'save' para solo guardar y
    'save_and_send' para guardar y enviar cotización a cliente"
  param :tm_background, String, desc: 'Observaciones del TM'
  param :cs_background, String, desc: 'Observaciones del CS'
  param :customer_background, String, desc: 'Observaciones del CS con respecto al cliente'
  param :emails, String, desc: "Emails destinatarios de la cotización, separados por ','"
  param :customer_product_warranties, Array, desc: 'Garantia de productos'
  param :spare_parts_amount, String, desc: 'spare_parts_amount de la cotización'

  param :labor_amount, String, desc: 'labor_amount de la cotización'
  param :viatic_amount, String, desc: 'viatic_amount de la cotización'
  param :subtotal_amount, String, desc: 'subtotal_amount de la cotización'
  param :iva_amount, String, desc: 'iva_amount de la cotización'
  param :total_amount, String, desc: 'total_amount de la cotización'
  def update
    quotation = ApiSingleton.get_update_quotation_api(quotations_params,
                                                      "#{current_user.get_roles_names_raw_json} (#{current_user.email})")
    if quotation.present? && quotation['data'].present? && quotation['data']['id'].present? && quotations_params[:save_type].eql?('save_and_send')
      NotificationMailer.quotation_email(quotations_params[:emails], quotation['data']['id'].to_s).deliver_now
      service = ApiSingleton.service_api({ id: quotations_params[:service_id] })
      if service.present? && service['customer']['push_notification_token'].present?
        message = {
          title: 'Nueva cotización',
          body: "Se ha generado una nueva cotización para el Folio [#{service['number']}]"
        }
        data = {
          folio: quotations_params[:service_id]
        }
        response = ApiSingleton.create_push_notification({ message: message, data: data,
                                                           token: service['customer']['push_notification_token'],
                                                           customer_id: service['customer']['id'] })
        PushNotifications.send_message(
          service['customer']['push_notification_token'], message, data, response['unreaded']
        )
      end
    end

    if quotation && quotation['data'] && (quotations_params[:save_type] != 'save_from_spare_part')
      if current_user.tech_managment?
        customer_service = ApiSingleton.service_api({ id: quotations_params[:service_id] })
        UserNotification.notify_revised_service(customer_service)
      elsif current_user.contact_center? || current_user.field_service? || current_user.admin?
        customer_service = ApiSingleton.service_api({ id: quotations_params[:service_id] })
        UserNotification.notify_audit_completed(customer_service) if quotations_params[:save_type] != 'save_and_send'
      end
    end
    render json: quotation.to_json,
           status: (quotation['data'] && quotation['data']['error'] && :internal_server_error || :ok)
  end

  api :PATCH, '/v1/quotations/:id/validate_payment', 'Valida un pago para una cotizacion en miele'
  param :id, String, desc: 'ID de la cotizacion a actualizar'
  param :payment_date, String, desc: 'Fecha de pago'
  param :customer_payment_date, String, desc: 'Fecha limite de pago'
  param :payment_channel, String, desc: 'Metodo de pago'
  def validate_payment
    ApiSingleton.get_update_quotation_api(quotations_params)['data']
    quotation = ApiSingleton.get_validate_payment_quotation_api(quotations_params)
    customer_service = ApiSingleton.service_api({ id: quotations_params[:service_id] })
    UserNotification.notify_paid_quotation(customer_service)
    render json: quotation.to_json
  end

  api :POST, '/v1/quotations/:id/create_spare_part', 'Asigna una refacción a un producto en Miele Core'
  param :id, String, desc: 'ID del cliente a asignar productos'
  param :products, String, desc: 'Array de ids de productos de refacción'
  param :customer_product_id, String, desc: 'ID del producto del cliente al que se le asociará la refacción'
  param :status, String,
        desc: "Estado de la refaccion, enviar 'requested' para solicitados y 'used' para los usados"
  example 'Request: ' + Rails.application.config.site_url + "/api/v1/quotations/1/create_spare_part\n
	Salida:
    {
        id: 1,
        quotation_id: 1,
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
    @quotation_product = ApiSingleton.get_create_quotation_spare_parts_api(quotation_spare_part_params)
    if begin
      @quotation_product.any?
    rescue StandardError
      false
    end
      render json: @quotation_product.to_json
    else
      render json: @quotation_product, status: :bad_request
    end
  end

  api :PATCH, '/v1/quotations/:id/spare_parts/:quotation_spare_part_id',
      'Actualiza refacción a un cliente en Miele Core'
  param :id, String, desc: 'ID del servicio al que pertenece la refacción'
  param :quotation_spare_part_id, String, desc: 'ID de la refacción'
  param :quantity, String, desc: 'Cantidad de la refacción asignada'
  param :requested_quantity, String, desc: 'Cantidad solicitada de la refacción (para el módulo de solicitudes)'
  param :warranty, String, desc: 'Garantía de la refacción asignada'
  param :price, String, desc: 'Precio de la refacción asignada'
  example 'Request: ' + Rails.application.config.site_url + "/api/v1/quotations/1/spare_parts/1\n
	Salida:
    {
        id: 1,
        quotation_id: 1,
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
    @quotation_spare_part = ApiSingleton.get_update_quotation_spare_parts_api(quotation_spare_part_params)
    if begin
      @quotation_spare_part['id']
    rescue StandardError
      false
    end
      render json: @quotation_spare_part.to_json
    else
      render json: @quotation_spare_part, status: :bad_request
    end
  end

  api :DELETE, 'v1/quotations/:id/spare_parts/:spare_part_id', 'Elimina un producto a un servicio en Miele Core'
  param :id, String, desc: 'ID del cliente a eliminar el producto'
  param :spare_part_id, String, desc: 'ID del producto del cliente, que se quiere eliminar'
  example 'Request: ' + Rails.application.config.site_url + "/api/v1/customers/1/customer_product/1\n
	Salida:
        { quotation_spare_part_id: 1, message: 'Producto de servicio eliminado' }
    "
  def delete_spare_parts
    @quotation_spare_part = ApiSingleton.destroy_quotation_spare_part_api(params[:id],
                                                                          params[:quotation_spare_part_id])
    if begin
      @quotation_spare_part['quotation_spare_part_id']
    rescue StandardError
      false
    end
      render json: @quotation_spare_part.to_json
    else
      render json: @quotation_spare_part, status: :bad_request
    end
  end

  private

  def quotations_params
    params.permit(:payment_date, :customer_payment_date, :payment_channel, :id, :service_id, :save_type,
                  :tm_background, :cs_background, :customer_background, :emails, :spare_parts_amount, :labor_amount,
                  :viatic_amount, :subtotal_amount, :iva_amount, :total_amount, customer_product_warranties: [])
  end

  def quotation_spare_part_params
    params.permit(:id, :quotation_spare_part_id, :quantity, :requested_quantity, :products, :status,
                  :customer_product_id, :warranty, :price)
  end
end


class NotificationMailer < ApplicationMailer
  include UrlHelper

  def policy_email(emails, customer_id, policy_id)
    begin
      policy_params = {}
      policy_params[:customer_id] = customer_id
      policy_params[:policy_id] = policy_id.to_s
      @policy = ApiSingleton.get_customer_policy_api(policy_params)['data']
      consumables_params = {}
      consumables_params[:products_ids] = @policy['policy_customer_products'].map do |policy_customer_product|
        policy_customer_product['customer_product_id']
      end.join(',')
      consumables_params[:country] = @policy['customer']['country']['iso']
      @consumables = ApiSingleton.consumables_api(consumables_params)['data']
    rescue StandardError
      @policy = nil
      @consumables = []
    end
    mail(to: emails,
         subject: "Creación de Póliza N° #{customer_id}-#{policy_id} para productos Miele") do |format|
      format.html { render "notification_mailer/policy_email_#{consumables_params[:country]}" }
    end
  end

  def payment_email(emails, service_id, _from = 'service', visit_id = nil)
    begin
      service_params_service = {}
      service_params_service[:id] = service_id.to_s
      @service = ApiSingleton.service_api(service_params_service)
      customer = ApiSingleton.get_customer_api(@service['customer_id'])
      @country = customer['data']['country']['iso']
      service_params_visit = {}
      service_params_visit[:id] = @service['last_visit']['id'].to_s
      @visit = ApiSingleton.get_visit_api(service_params_visit)['data']
      @payment_url = "#{Rails.configuration.site_url}/payments?object_id=#{@service['id']}&object_class=Servicio&customer_id=#{@service['customer_id']}&amount=#{@service['total_amount']}"
      @show_payment_options = !(!@visit.nil? && @visit['no_payment'])
    rescue StandardError => e
        @service = @service || nil
        @payment_url = "#{Rails.configuration.site_url}/payments?object_id=#{@service["id"]}&object_class=Servicio&customer_id=#{@service["customer_id"]}&amount=#{@service["total_amount"]}" rescue nil
    
    end
    @pago = MoneyUtils.get_money_country_format(@service['total_amount'], @country)
    rute = "notification_mailer/payment_email_#{@country}"
    mail(to: emails,
         subject: 'Confirmación visita Miele') do |format|
      format.html { render rute }
    end
  end

  def success_payment(payment)
    resource_id = payment.object_id

    if payment.object_class == 'Cotizacion'
      quotation = ApiSingleton.get_quotation_api({ id: resource_id })['data']
      service = quotation['service']
      service_id = quotation['service_id']
    end

    service ||= ApiSingleton.service_api({ id: resource_id })
    service_id ||= service['id']
    customer = ApiSingleton.get_customer_api(payment.customer_id)
    country = (customer['data']['country']['iso'] || 'CL').downcase
    emails = Rails.application.secrets.contact_emails[:success_payment][country.to_sym].split(',').push(customer['data']['email'])

    @url = url_edit_service(customer_id: payment.customer_id, object_id: service_id)
    @service_type = service['service_type']
    @folio = service['number']
    @transaction_id = payment.transaction_id
    @time = Time.zone.now.strftime('%H:%M:%S')

    mail_template = "notification_mailer/success_payment/#{country}"

    mail(to: emails,
         subject: "AVISO: Pago exitoso de Servicio [#{@service_type}] - #{@folio}") do |format|
      format.html { render mail_template }
    end
  end

  def quotation_email(emails, quotation_id)
    begin
      quotation_params = {}
      quotation_params[:id] = quotation_id
      @quotation = ApiSingleton.get_quotation_api(quotation_params)['data']
      @country = @quotation['service']['customer']['country']['iso']
      @quotation_url = "#{Rails.configuration.site_url}/quotations/#{quotation_params[:id]}/show"
    rescue StandardError => e
      @quotation_params = nil
      @quotation_url = '#'
    end
    mail(to: emails,
         subject: 'Cotización de visita Miele') do |format|
      format.html { render "notification_mailer/quotation_email_#{@country}"}
    end
  end

  def visit_report_email(emails, service_id, visit_id)
    begin
      service_params = {}
      service_params[:id] = service_id
      @service = ApiSingleton.service_api(service_params)
      @report_url = "#{Rails.configuration.site_url}/services/#{service_id}/report_pdf?visit_id=#{visit_id}"
      customer = ApiSingleton.get_customer_api(@service['customer_id'])
      @country = customer['data']['country']['iso']
    rescue StandardError => e
      @service = nil
      @report_url = '#'
    end
    mail(to: emails,
         subject: 'Visita Finalizada Miele') do |format|
      format.html { render "notification_mailer/visit_report_email_#{@country}" }
    end
  end
end


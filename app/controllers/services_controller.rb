class ServicesController < ApplicationController
  include ActionController::Helpers

  skip_before_action :authenticate_user!, only: [:report_pdf]

  def get_payment_type(payment_data, service)
    payment_type = ''
    aux = payment_data['provider_params'].split(',')
    if payment_data['payment_method_id'] == 1
      payment_type_code = aux[9].split('=>')
      if payment_type_code[1] == '"VD"'
        payment_type = 'Débito'
      else
        installments_number = begin
          aux[12].split('=>')
        rescue StandardError
          ''
        end
        payment_type = 'Cŕedito - ' + installments_number[1].to_s.chop + ' cuotas'
      end
    else
      payment_type = service['payment_channel'] + ' - ' + payment_data.payment_method['name']
    end
  end

  def report_pdf
    service = ApiSingleton.service_api(service_params)
    customer = ApiSingleton.get_customer_api(service['customer_id'])
    customer = customer['data']
    payment_data = Payment.where(object_id: service['id'], object_class: 'Servicio').take
    @country = customer['country']['iso']
    visit = ApiSingleton.get_visit_api({ id: service_params['visit_id'] })
    visit = visit['data'] if visit
    if payment_data.nil?
      if visit['validated_payment']
        puts 'visita pagada'
        payment_type = visit['payment_channel']
      end
    elsif payment_data['provider_params'].blank?
      payment_type = 'Si. Manual' if service['validated_payment']
    else
      payment_type = get_payment_type(payment_data, service)
    end

    administrative_demarcation_fn = ''
    if customer['administrative_demarcation_fn'].nil?
      administrative_demarcation_fn = if customer['zipcode_fn'] != ''
                                        customer['state_fn'].to_s + '' + ', Código Postal: ' + customer['zipcode_fn'].to_s
                                      else
                                        customer['state_fn'].to_s + ''
                                      end
    else
      administrative_demarcation_fn = customer['administrative_demarcation_fn']['admin3_admin1']
    end
    unless service_params[:visit_id].blank?
      visit = service['visits'].find do |visit|
        visit['id'].try(:to_s) == service_params[:visit_id].try(:to_s)
      end
    end

    visit['visit_customer_products'].each_with_index do |visit_customer_product, index|
      spare_parts_params = {
        customer_product_id: visit_customer_product['customer_product_id'],
        id: visit_customer_product['customer_product_id'],
        visit_id: visit['id']
      }
      visit_products_requested = ApiSingleton.get_customer_products_product_requested_spare_parts(spare_parts_params)
      visit_products_used = ApiSingleton.get_customer_products_product_spare_parts(spare_parts_params)
      visit_product_images = ApiSingleton.file_resources_api(visit_customer_product['id'])
      checklist_product_images = ApiSingleton.check_list_file_resources_api(visit_customer_product['customer_product_id'])
      visit['visit_customer_products'][index]['visit_products_requested'] = visit_products_requested['data']
      visit['visit_customer_products'][index]['visit_products_used'] = visit_products_used
      visit['visit_customer_products'][index]['visit_product_images'] = visit_product_images['data']
      visit['visit_customer_products'][index]['checklist_product_images'] = checklist_product_images['data']
    end

    visit['payment_resources'] = visit['payment_resources'].select do |payment_resource|
      payment_resource['mime'].include?('image')
    end

    event = (visit.nil? ? service['calendar_events'].try(:last) : visit['calendar_event'])
    principal_technician = (visit['principal_technician_id'].blank? ? nil : Technician.includes(:user).find_by_id(visit['principal_technician_id']))
    pdf = render pdf: format('Servicio %s', "#{service['number']}-#{Time.now}"),
                 template: 'services/report_pdf.pdf.erb',
                 page_size: 'Letter',
                 margin: { top: 13.5,
                           left: 0,
                           right: 0 },
                 header: {
                   content: render_to_string('layouts/shared/header.pdf.erb')
                 },
                 footer: {
                   content: render_to_string('layouts/shared/footer.pdf.erb')
                 },
                 locals: { administrative_demarcation_fn: administrative_demarcation_fn, customer: customer,
                           country: @country, payment_type: payment_type, payment_data: payment_data, service: service, visit: visit, principal_technician: principal_technician, event: event }
  end

  private

  def service_params
    params.permit :id, :visit_id
  end
end

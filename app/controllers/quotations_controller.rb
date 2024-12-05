class QuotationsController < ApplicationController
    include ActionController::Helpers
	#load_and_authorize_resource
	skip_before_action :authenticate_user!, only: [:show]
	def show
        quotation = ApiSingleton.get_quotation_api(quotation_params)["data"] rescue {"error"=>"No se ha encontrado cotizacion."}
        visit = quotation["visit"]
        service = quotation["service"]
        requested_spare_parts = quotation["requested_spare_parts"]
        used_spare_parts = quotation["used_spare_parts"]
        country = service["customer"]["country"]["iso"] rescue "MX"
        spare_parts_amount = (!quotation["spare_parts_amount"].blank?  ?  quotation["spare_parts_amount"]: 0.0)
        laborAmout = (!quotation["labor_amount"].blank?  ?  quotation["labor_amount"]: 0.0)
        viaticAmout = (!quotation["viatic_amount"].blank?  ?  quotation["viatic_amount"]: 0.0)
        subtotalAmount = (!quotation["subtotal_amount"].blank?  ?  quotation["subtotal_amount"]: 0.0) 
        ivaAmount = (!quotation["iva_amount"].blank?  ?  quotation["iva_amount"]: 0.0) 
        totalAmount = (!quotation["total_amount"].blank?  ?  quotation["total_amount"]: 0.0) 
        payment_url = "#{Rails.configuration.site_url}/payments?object_id=#{quotation["id"]}&object_class=Cotizacion&customer_id=#{service["customer_id"]}&amount=#{totalAmount}&is_quotation=#{true}&service_id=#{service["id"]}" rescue "#"
        pdf =  render :pdf => 'Cotización %s' % "#{visit && visit["id"] || " Generada con problemas "}-#{Time.now}",
        :template => "quotations/show_#{country}.pdf.erb",
        :page_size   => 'Letter',
        :margin => { :top => 13.5,
            :left => 0,
            :right => 0
        },
        :header => {
            :content => render_to_string('layouts/shared/header.pdf.erb')
        },
        :locals => {payment_url: payment_url, service: service, visit: visit, quotation: quotation, requested_spare_parts: requested_spare_parts, used_spare_parts: used_spare_parts, spare_parts_amount: spare_parts_amount, viaticAmout: viaticAmout, laborAmout: laborAmout, subtotalAmount: subtotalAmount, ivaAmount: ivaAmount, totalAmount: totalAmount, country: country}
   end

    private
    def quotation_params
        params.permit :id, :service_id, :visit_id
    end
end

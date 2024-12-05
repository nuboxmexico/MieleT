class CieloController < ApplicationController
    before_action :load_resource, only: %i[index]
    skip_before_action :authenticate_user!
    skip_before_action :verify_authenticity_token

    def index
      result = ::Payments::Cielo.new.generate_payment_link(resource: @resource)

      if result.success?        
        Payment.create!(
          customer_id: @resource.customer.id,
          object_id: @resource.id,
          object_class: @resource.object_class,
          amount: @resource.total_amount,
          status: :pending,
          transaction_id: result.transaction_id,
          provider_params: result.body,
          payment_method: PaymentMethod.find_by_name('Cielo')
        )
      end

      redirect_to result.checkout_url
    end
  
    # Webhook subscription
    def payment_notification
      if params['checkout_cielo_order_number'].present?
        cielo_payment_obj = ::Payments::Cielo.new.queryStateOfPayment(checkout_cielo_order_number: params['checkout_cielo_order_number'])
        @payment = Payment.find_by!(transaction_id: params['product_id'])
        @payment.update!(provider_params: cielo_payment_obj)

        if cielo_payment_obj['payment']['status'] == "Paid"
          NotificationMailer.success_payment(@payment).deliver_later if @payment.update!(status: :completed)
        end
      end

      head :no_content
    end
  
    private
  
    def load_resource 
      @resource = if params[:is_quotation] == 'true'
                    ::Responses::Quotation.new(
                      resource: ApiSingleton.get_quotation_api({ id: params[:object_id] })
                    )
  
                  else
  
                    ::Responses::Service.new(
                      resource: ApiSingleton.service_api({ id: params[:object_id] })
                    )
                  end
    end
end
  
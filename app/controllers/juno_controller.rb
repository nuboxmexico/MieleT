class JunoController < ApplicationController
  before_action :load_resource, only: %i[index]
  skip_before_action :authenticate_user!
  skip_before_action :verify_authenticity_token

  def index
    result = ::Payments::Juno.new.generate_charge(resource: @resource)

    if result.success?
      Payment.create!(
        customer_id: @resource.customer.id,
        object_id: @resource.id,
        object_class: @resource.object_class,
        amount: @resource.total_amount,
        status: :pending,
        transaction_id: result.code,
        provider_params: result.body,
        payment_method: PaymentMethod.find_by_name('Juno')
      )
    end

    redirect_to result.checkout_url
  end

  # Webhook subscription
  def payment_notification
    charge = params['data'].first['attributes']['charge']
    transaction_id = charge['code']
    @payment = Payment.find_by!(transaction_id: transaction_id)

    NotificationMailer.success_payment(@payment).deliver_later if @payment.update!(status: :completed)

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

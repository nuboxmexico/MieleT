class MastercardController < ApplicationController
  layout 'payments'
  skip_before_action :authenticate_user!
  def mastercard_lightbox
    gateway_secrets = Rails.application.secrets[params[:provider]]
    @payment_method = PaymentMethod.find_by(provider: params[:provider])
    @payment = Payment.find_or_create_by(object_id: params[:object_id], user_id: current_user.try(:id),
                                         customer_id: params[:customer_id], amount: params[:amount], object_class: params[:object_class])
    @payment.update(payment_method_id: @payment_method.id) unless @payment_method.nil?
    gateway = Gateway::MastercardGateway.new(
      gateway_secrets[:session_url],
      gateway_secrets[:checkout_url],
      gateway_secrets[:merchant_id],
      gateway_secrets[:auth]
    )
    session_id = gateway.session_id(@payment)

    @checkout_url = gateway_secrets[:checkout_url]
    @checkout_configuration = gateway.checkout_configuration(@payment, session_id)
    response = {
      checkout_url: @checkout_url,
      error_callback_url: "#{Rails.application.config.site_url}/mastercard/errorCallback",
      cancel_callback_url: "#{Rails.application.config.site_url}/mastercard/cancelCallback",
      complete_callback_url: "#{Rails.application.config.site_url}/mastercard/completeCallback",
      checkout_configuration: @checkout_configuration
    }

    respond_to do |format|
      format.json { render json: response }
      format.js
    end
  end

  def load_mastercard_script
    @checkout_url = Rails.application.secrets[params[:provider]][:checkout_url]

    respond_to do |format|
      format.js
    end
  end

  def cancelCallback
    @payment = Payment.where(object_id: params[:object_id], customer_id: params[:customer_id]).last
  end

  def errorCallback
    @payment = Payment.where(object_id: params[:object_id], customer_id: params[:customer_id]).last
  end

  def completeCallback
    @payment = Payment.where(object_id: params[:object_id], customer_id: params[:customer_id]).last

    if @payment.status != 'completed'
      @payment.update(status: 'completed')
      NotificationMailer.success_payment(@payment).deliver_later
    end

    payment_data = {
      result_indicator: params[:resultIndicator],
      session_version: params[:sessionVersion]
    }

    @payment.update(provider_params: payment_data, token_ws: params[:resultIndicator])
  end
end

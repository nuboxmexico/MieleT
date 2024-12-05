class WebpayController < ApplicationController
  layout 'payments'
  before_action :load_data, only: %i[pay confirmation success failure]
  skip_forgery_protection only: %i[pay confirmation success]
  skip_before_action :authenticate_user!

  def pay
    if @payment.status == 'completed'
      flash.notice = 'El servicio ya fue pagado'
      if current_user.nil?
        redirect_to "/payments/#{@payment.id}/thanks" and return
      elsif @payment.object_class == 'Visita'
        visit = ApiSingleton.get_visit_api({ id: @payment.object_id })
        redirect_to "/customers/#{@payment.customer_id}/services/#{visit['data']['service_id']}/new_visit" and return
      else
        redirect_to "/customers/#{@payment.customer_id}/new_service" and return
      end
    end

    result = WebpayPlus.init_transaction({
                                           "buy_order": @payment.id,
                                           "session_id": rand(1_111_111..9_999_999).to_s,
                                           "amount": @payment.amount.to_i
                                         }, request.base_url.to_s)

    if result['token'].present? && result['url'].present?
      token = result['token']
      url   = result['url']
      @payment.update(token_ws: token) if @payment
      response = Net::HTTP.post_form(URI(url.to_s), token_ws: token.to_s)
      render html: response.body.html_safe
      nil
    else
      redirect_to webpay_failure_path({ object_id: @payment.object_id }),
                  alert: 'Ha ocurrido un problema realizando el pago'
      nil
    end
  end

  def confirmation
    begin
      token_tbk = params[:token_ws]
      webpay_results = WebpayPlus.transaction_confirmation(token_tbk)

      if webpay_results
        if webpay_results['status'] == 'AUTHORIZED' && webpay_results['response_code'] == 0
          puts webpay_results
          @payment = Payment.where(token_ws: token_tbk).try(:last)

          unless %w[failed invalid].include?(@payment.status)
            @payment.update_attributes(provider_params: webpay_results)
            Rails.logger.info "payment_state:#{@payment.status}"
            if @payment
              @payment.perform_payment
              NotificationMailer.success_payment(@payment).deliver_later
              redirect_to webpay_success_path(webpay_params(params).merge(object_id: @payment.object_id))
              return
            end
          end
        else
          Rails.logger.error "Error in Payment #{@payment.try(:id)} - #{@payment.try(:order).try(:number)}"
          redirect_to webpay_failure_path(webpay_params(params).merge(object_id: @payment.object_id)),
                      alert: I18n.t('payment.transaction_error') and return
        end
      end
    rescue Exception => e
      Rails.logger.error "Error in Payment #{@payment.try(:id)} - #{@payment.try(:order).try(:number)}"
      Rails.logger.error e
      redirect_to webpay_failure_path(webpay_params(params).merge(object_id: @payment.object_id)),
                  alert: I18n.t('payment.transaction_error') and return
    end

    redirect_to webpay_failure_path(webpay_params(params).merge(rejected: true, object_id: @payment.object_id)),
                alert: I18n.t('payment.transaction_error')
  end

  def success
    redirect_to root_path and return if @payment.blank?

    Rails.logger.info "payment_state:#{@payment.status} " if @payment
    Rails.logger.info "[WebpayController : Success] - Order: #{@payment.object_id}" if @payment

    if @payment.status != 'completed'
      redirect_to webpay_failure_path(webpay_params(params).merge(object_id: @payment.object_id)) and return
    elsif @payment.status == 'completed'
      flash.notice = 'Pago procesado satisfactoriamente'
      if current_user.nil?
        redirect_to "/payments/#{@payment.id}/thanks" and return
      elsif @payment.object_class == 'Visita'
        visit = ApiSingleton.get_visit_api({ id: @payment.object_id })
        redirect_to "/customers/#{@payment.customer_id}/services/#{visit['data']['service_id']}/new_visit" and return
      else
        redirect_to "/customers/#{@payment.customer_id}/new_service" and return
      end
    else
      redirect_to webpay_failure_path(webpay_params(params).merge(object_id: @payment.object_id)) and return
    end
  end

  def failure
    @rejected = params[:rejected] == 'true'
  end

  private

  def load_data
    puts 'LOAD DATA'
    if params[:token_ws]
      @payment = Payment.find_by(token_ws: params[:token_ws]) if params[:token_ws]
    else
      # puts "ELSEEEEEEEEEEEEEEEEEEEEEEEE"
      # if params[:quotation_id] && params[:is_quotation]
      #   @payment = Payment.find_or_create_by(object_id: params[:object_id], user_id: current_user.try(:id), customer_id: params[:customer_id], amount: params[:amount], object_class: params[:object_class])
      # end
      @payment = Payment.find_or_create_by(object_id: params[:object_id], user_id: current_user.try(:id),
                                           customer_id: params[:customer_id], amount: params[:amount], object_class: params[:object_class])
      unless params[:provider].blank?
        @payment_method = PaymentMethod.find_by(provider: params[:provider])
        @payment.update(payment_method_id: @payment_method.id) unless @payment_method.nil?
      end

    end
  end

  def webpay_params(params)
    params = params.permit(:token_ws, :object_id)
  end

  # Same as CheckoutController#completion_route
  def completion_route(customer_id)
    "/customers/#{customer_id}/show"
  end
end

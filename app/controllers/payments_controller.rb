class PaymentsController < ApplicationController
	layout "payments"
    skip_before_action :authenticate_user!, only: [:index, :thanks]
	before_action :load_data, only: [:index]
	before_action :get_payment, only: [:thanks]
	
	def index
		
	end

	def thanks
		
	end

	private
	def get_payment
		@payment = Payment.find_by(id: params[:id])
	end

    def load_data
        @payment = Payment.find_or_create_by(object_id: params[:object_id], user_id: current_user.try(:id), customer_id: params[:customer_id], amount: params[:amount], object_class: params[:object_class])
		@payment_amount = params[:amount] unless params[:amount].blank?
		@is_quotation = params[:is_quotation] unless params[:is_quotation].blank?
		@service_id = params[:service_id] unless params[:service_id].blank?
		unless params[:provider].blank?
			@payment_method = PaymentMethod.find_by(provider: params[:provider])
			unless @payment_method.nil?
				@payment.update(payment_method_id: @payment_method.id)
			end
		end
    end
end


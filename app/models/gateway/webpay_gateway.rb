class Gateway::WebpayGateway

    def actions
        %w{capture void}
    end
    
    def auto_capture?
        true
    end
    
    def source_required?
        false
    end
    
    def supports?(source)
        true
    end
    
    def provider_class
        self.class
    end
    
    def method_type
        'webpay'
    end
    
    def can_capture?(payment)
        ['checkout', 'pending'].include?(payment.status)
    end
    
    def provider
        provider_class
    end
    
    def self.STATE
        'webpay'
    end
    
    def purchase(amount, transaction_details, options = {})
        #ActiveMerchant::Billing::Response.new(true, "success", {}, {})
    end
    
    def capture(money_cents, response_code, gateway_options)
        #ActiveMerchant::Billing::Response.new(true,  "Transacción Aprobada", {}, {})
    end
    
    def confirmation token_ws, base_url
        webpay_results = Webpay::Functions.get_transaction_result(token_ws, base_url)
        payload =  Webpay::Payloads.getNormalPayload(webpay_results)
        
        accepted = true
        
        if(webpay_results['error_desc'] == 'TRX_OK')
            unless payment_exists?(payload["transactionDetails"]["buyOrder"])
                accepted = false
                Rails.logger.info "Payment #{ payload["transactionDetails"]["buyOrder"]} not exists"
            end
            if payment_paid?(payload["transactionDetails"]["buyOrder"])
                accepted = false
                Rails.logger.info "Payment #{ payload["transactionDetails"]["buyOrder"]} already paid"
            end
        else
            accepted =  false
            Rails.logger.info "Invalid response for #{payload["transactionDetails"]["buyOrder"]}"
            Webpay::Functions.acknowledge_transaction(token_ws, base_url)
        end
        
        if accepted
            return payload
        else
            return nil
        end
    end
    
    def perform_payment payment_id, state
        puts "#{payment_id} - #{state}"
        payment = Payment.where(id: payment_id).last
        return unless payment
        
        begin
            if state == "accepted"
                payment.update(status: "completed")
            #    payment.capture!
            elsif state == "rejected"
                payment.update(status: "rejected")
            end
        
        rescue Exception => e
            Rails.logger.error("Error al procesar pago orden #{payment.number}: E -> #{e.message}")
        end
    end
    
    def check_payment(payment_id)
        unless payment_exists?(payment_id)
            accepted = false
            Rails.logger.info "Payment #{ payment_id} not exists"
        end
        if payment_paid?(payment_id)
            accepted = false
            Rails.logger.info "Payment #{ payment_id} already paid"
        end
        return accepted
    end
   
    private
    def payment_exists?(object_id)
        payment = Payment.where(object_id: object_id).last
        if payment.blank?
            return false
        else
            return true
        end
    end
    def payment_paid? object_id
        payment = Payment.where(object_id: object_id).last
        return payment.try(:status) == "paid"
    end
end
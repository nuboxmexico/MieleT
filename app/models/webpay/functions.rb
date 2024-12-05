class Webpay::Functions
    #Normal transacition
    def self.init_transaction(payment, base_url)
    self.init_webpay(base_url)
    trx_id  = payment.transaction_id
    amount = payment.amount.to_i
    return @webpay.getNormalTransaction.initTransaction(amount, payment.object_id, trx_id, @urlReturn, @urlFinal)
    end

    def self.get_transaction_result(token, base_url)
    self.init_webpay(base_url)
    return @webpay.getNormalTransaction.getTransactionResult(token)
    end

    def self.acknowledge_transaction(token, base_url)
    self.init_webpay(base_url)
    return @webpay.getNormalTransaction.acknowledgeTransaction(token)
    end

    def self.nullify_transaction(token, base_url, authorizationCode, authorizedAmount, buyOrder, nullifyAmount)
    self.init_webpay(base_url)
    return @webpay.getNullifyTransaction.nullify(authorizationCode, authorizedAmount, buyOrder, nullifyAmount, Rails.application.secrets.webpay_commerce_code.to_s)
    end

    private
    def self.init_webpay(base_url)
            libwebpay = Webpay::Libwebpay.new
            config = libwebpay.getConfiguration
            config.commerce_code = Rails.application.secrets.webpay_commerce_code
            config.environment = Rails.application.secrets.environment
            config.private_key = OpenSSL::PKey::RSA.new(File.read(Rails.application.secrets.webpay_client_private_key))
            config.public_cert = OpenSSL::X509::Certificate.new(File.read(Rails.application.secrets.webpay_client_certificate))
            config.webpay_cert = OpenSSL::X509::Certificate.new(File.read(Rails.application.secrets.webpay_tbk_certificate))        
            
            @webpay = libwebpay.getWebpay(config)
            @urlReturn = base_url + Rails.application.secrets.webpay_return_url.to_s
            @urlFinal = base_url + Rails.application.secrets.webpay_final_url.to_s
    end               

end
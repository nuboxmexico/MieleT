require 'signer'
require 'savon'
require_relative 'verifier'
require_relative 'configuration'
require_relative 'ws'

class Webpay::Libwebpay

    @configuration
    @webpay

    def getWebpay(config)
        if @webpay == nil
        @webpay = Webpay::Ws.new(config)
        end
        return @webpay
    end
    
    def getConfiguration
        if @configuration == nil
        @configuration = Webpay::Configuration.new
        end
        return @configuration
    end

end
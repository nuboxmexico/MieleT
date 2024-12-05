module Payments
    # Service paymetns for generate transactions with JUNO
    class Cielo
        attr_reader :token

        CIELO = JSON.parse(Rails.application.secrets.to_json, object_class: OpenStruct).payments.cielo
        
        HEADERS = {
        'Content-Type': 'application/json;charset=UTF-8',
        }.freeze

        TOKEN_HEADERS = {
        'Content-Type': 'application/x-www-form-urlencoded'
        }.freeze

        # @param token [String] the token to access the API
        def initialize
            @token = generate_token
        end

        def generate_token
            body = {
                grant_type: 'client_credentials'
            }
            response = auth_conn.post('v2/token') do |req|
                req.body = URI.encode_www_form(body)
            end

            response.body['access_token']
        end

        def generate_payment_link(resource:)
            body = Payloads::Payments::Cielo::GenerateCharge.new(resource: resource).as_json 
            response = conn.post('v1/products') do |req|
                req.body = body.to_json
            end       
            ::Responses::Payments::Cielo::GenerateCharge.new(response: response)
        end

        def queryStateOfPayment(checkout_cielo_order_number:)
            response = conn.get("v2/orders/#{checkout_cielo_order_number}")
            response.body
        end

        private

        def auth_conn
            @auth_conn ||= Faraday.new(CIELO.api_url) do |f|
                f.headers = TOKEN_HEADERS
                f.request :basic_auth, CIELO.client_id, CIELO.client_secret
                f.use Faraday::Request::UrlEncoded
                f.use Faraday::Adapter::NetHttp
                f.response :json
            end
        end

        def conn
            @conn ||= Faraday.new(CIELO.api_url) do |f|
                f.headers = HEADERS
                f.request :authorization, 'Bearer', @token
                f.request :json
                f.response :json
                f.use Faraday::Adapter::NetHttp
            end
        end
    end
end
  
module Payments
  # Service paymetns for generate transactions with JUNO
  class Juno
    attr_reader :token

    JUNO = JSON.parse(Rails.application.secrets.to_json, object_class: OpenStruct).payments.juno
    HEADERS = {
      'X-Api-Version': JUNO.api_version.to_s,
      'Content-Type': 'application/json;charset=UTF-8',
      'X-Resource-Token': JUNO.private_key
    }.freeze

    TOKEN_HEADERS = {
      'Content-Type': 'application/x-www-form-urlencoded'
    }.freeze

    # @param token [String] the token to access the API
    def initialize
      @token = generate_token
    end

    # @param resource [Responses::Service, Responses::Quotation] must be a Service or Quotation from core
    def generate_charge(resource:)
      body = Payloads::Payments::Juno::GenerateCharge.new(resource: resource).as_json
      response = conn.post('charges') do |req|
        req.body = body.to_json
      end

      ::Responses::Payments::Juno::GenerateCharge.new(response: response)
    end

    def generate_token
      body = {
        grant_type: 'client_credentials'
      }

      response = auth_conn.post('oauth/token') do |req|
        req.body = URI.encode_www_form(body)
      end

      response.body['access_token']
    end

    private

    def auth_conn
      @auth_conn ||= Faraday.new(JUNO.auth_url) do |f|
        f.headers = TOKEN_HEADERS
        f.request :basic_auth, JUNO.client_id, JUNO.client_secret
        f.use Faraday::Request::UrlEncoded
        f.use Faraday::Adapter::NetHttp
        f.response :json
      end
    end

    def conn
      @conn ||= Faraday.new(JUNO.integration_url) do |f|
        f.headers = HEADERS
        f.request :authorization, 'Bearer', @token
        f.request :json
        f.response :json
        f.use Faraday::Adapter::NetHttp
        f.response :logger, ::Logger.new($stdout), bodies: true
      end
    end
  end
end

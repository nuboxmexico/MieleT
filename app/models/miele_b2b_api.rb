class MieleB2bApi
  URL_DEV = 'http://localhost:4000'#'https://miele.garagelabs.cl' #  
  URL_API =  Rails.env.staging? ? 'http://preprod.miele.garagelabs.cl' : 'https://www.mielecustomers.cl'
  API_TOKEN_DEV ="W04CzpXeH1W7Cy7ikkegZwtt"
  API_TOKEN = Rails.env.staging? ? "W04CzpXeH1W7Cy7ikkegZwtt" : "W04CzpXeH1W7Cy7ikkegZwtt" #actualizar token produccion.
  
  
  def self.update_state_detail_quotation_product(customer_product_hash)
    response = api_connection.patch do |req|
      req.url "/api/v1/detail_quotation_products/update_state"
      req.body = customer_product_hash.to_json
    end
    return process_response(response)
  end

  def self.get_customer_quotations(customer_hash)
    response = api_connection.get do |req|
      req.url "/api/v1/customers/get_quotations"
      req.body = customer_hash.to_json
    end
    return process_response(response)
  end

  def self.close_dispatch_group(dispatchgroup_id, visit_report_url_hash)
    response = api_connection.post do |req|
      req.url "/api/v1/dispatch_groups/#{dispatchgroup_id}/close"
      req.body = visit_report_url_hash.to_json
    end
    return process_response(response)
  end

  private 
    def self.api_connection
      return Faraday.new(
        url: Rails.env.development? ? URL_DEV : URL_API,
        headers: request_headers
      )
    end

    def self.request_headers
      return {
        'Authorization' => "Token token=#{Rails.env.development? ? API_TOKEN_DEV : API_TOKEN}",
        'Content-Type' => 'application/json'
      }
    end

    def self.process_response(response)
      if response.status == 200
        return JSON.parse(response.body)
      else
        return nil
      end
    end
end
module Responses
  module Payments
    module Cielo
      class GenerateCharge
        attr_reader :response, :body, :type, :name, :transaction_id, :checkout_url, :created_date, :amount

        def initialize(response:)    
          @response = response
          @body = response.body
          @type = @body['type']
          @name = @body['name']
          @transaction_id = @body['id']
          @checkout_url = @body['shortUrl']
          @created_date = @body['createdDate']
          @amount = @body['price']
        end

        def success?
          @response.status.to_s.match?(/2\d\d/)
        end
      end
    end
  end
end

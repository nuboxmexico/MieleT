module Responses
  module Payments
    module Juno
      class GenerateCharge
        attr_reader :body, :response, :charge, :charge_id, :checkout_url, :due_date, :amount, :code

        def initialize(response:)
          @response = response
          @body = response.body
          @charge = @body['_embedded']['charges'][0]
          @charge_id = @charge['id']
          @checkout_url = @charge['checkoutUrl']
          @due_date = @charge['dueDate']
          @amount = @charge['amount']
          @code = @charge['code']
        end

        def success?
          @response.status.to_s.match?(/2\d\d/)
        end
      end
    end
  end
end

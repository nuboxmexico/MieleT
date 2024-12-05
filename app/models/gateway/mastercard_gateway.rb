class Gateway::MastercardGateway

    def initialize(session_url, checkout_url, merchant_id, auth)
      @session_url = session_url
      @checkout_url = checkout_url
      @merchant_id = merchant_id
      @auth = auth
    end
  
    def session_id(order)
      response = Faraday.new(@session_url).post do |req|
        req.headers['Authorization'] = "Basic #{@auth}"
        req.body = {
          "apiOperation": "CREATE_CHECKOUT_SESSION",
          "interaction": {
            "operation": "PURCHASE"
          },
          "order": {
            "id": "#{order.id}",
            "currency": "MXN"
          }
        }.to_json
      end
      response_data = JSON.parse(response.body)
      if response.status == 201
        return response_data['session']['id']
      else
        return response_data['explanation']
      end
    end
  
    def checkout_configuration(payment, session_id)
      return {
        merchant: "#{@merchant_id}",
        session: { 
          id: "#{session_id}"
        },
        order: {
          currency: 'MXN',
          description: "#{payment.object_id}",
          amount: payment.amount.to_f.round(2)
        },
        interaction: {
          operation: 'PURCHASE',
          merchant: {
            name: 'MIELE SHOP CIB'
          },
          displayControl: {
            billingAddress: 'HIDE'
          }
        }
      }
    end
  end
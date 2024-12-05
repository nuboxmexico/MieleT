module Payloads
  module Payments
    module Cielo
      # Handle the body build for Payments::Cielo#generate_charge
      class GenerateCharge
        # @param resource [Responses::Service, Responses::Quotation] must be a Service or Quotation from core
        def initialize(resource:)
          @resource = resource
        end

        # @return [Hash] the body to be sent to Cielo when generate a charge
        def as_json
          {  
            type: "Service",
            name: "Pagamento de Serviço ##{folio}",
            sku: folio,
            description: "pagamento de serviços para Miele",
            price: amount,
            shipping: {
              type: "WithoutShipping"
            },
          }
        end
 
        private

        def amount
          (@resource.total_amount.to_s.delete('.') + "0").to_f
        end

        def folio
          @resource.folio
        end
      end
    end
  end
end

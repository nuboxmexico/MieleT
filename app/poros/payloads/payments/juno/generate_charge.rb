module Payloads
  module Payments
    module Juno
      # Handle the body build for Payments::Juno#generate_charge
      class GenerateCharge
        # @param resource [Responses::Service, Responses::Quotation] must be a Service or Quotation from core
        def initialize(resource:)
          @resource = resource
        end

        # @return [Hash] the body to be sent to Juno when generate a charge
        def as_json
          {
            charge: { description: description,
                      amount: amount,
                      installments: 1,
                      paymentTypes: ['CREDIT_CARD'] },
            billing: { name: customer_name,
                       document: rfc,
                       address: address }
          }
        end

        # @return [Hash] address data based on the service customer
        def address
          { street: street,
            number: street_number,
            city: city,
            state: state,
            postCode: rfc_cleaner(zipcode) }
        end

        private

        def customer
          return @customer if defined?(@customer)

          @customer ||= @resource.customer
        end

        def amount
          @resource.total_amount
        end

        def description
          @resource.juno_description
        end

        def rfc_cleaner(rfc)
          return '' if rfc.blank?

          rfc.scan(/\d|\w/).join
        end

        def rfc
          return rfc_cleaner(customer.rfc) if customer.rfc.present?
          return rfc_cleaner(customer.rut) if customer.rut.present?

          'N/A'
        end

        def state
          state = customer.administrative_demarcation.admin_name_1
          selected_state = CS.states(:br).select { |_state_code, state_name| state_name == state }
          selected_state.keys.first
        end

        def zipcode
          customer.administrative_demarcation.zipcode
        end

        def city
          customer.administrative_demarcation.admin_name_2
        end

        def street
          customer.street_name_fn
        end

        def street_number
          customer.ext_number_fn
        end

        def customer_name
          "#{customer.names} #{customer.lastname} #{customer.surname}"
        end
      end
    end
  end
end

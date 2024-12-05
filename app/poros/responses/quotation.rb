module Responses
  # This class is used to handle the Quotation data from the core
  class Quotation < Base
    attr_reader :customer, :total_amount, :folio, :object_class, :id

    def initialize(resource:)
      super
      @customer = @resource.service.customer
      @total_amount = @resource.total_amount
      @folio = "#{@resource.service.number}-Q#{@resource.quotation_number}"
      @object_class = 'Cotizacion'
      @id = @resource.id
    end
  end
end

module Responses
  # This class is used to handle the Service data from the core
  class Service < Base
    attr_reader :customer, :total_amount, :folio, :object_class, :id

    def initialize(resource:)
      super
      @customer = @resource.customer
      @total_amount = @resource.total_amount
      @folio = @resource.number
      @object_class = 'Servicio'
      @id = @resource.id
    end
  end
end

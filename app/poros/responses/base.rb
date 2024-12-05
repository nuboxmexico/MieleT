module Responses
  class Base
    attr_reader :resource

    # @param resource [Hash] must be a Model as json from core
    # @return [OpenStruct] the resource as OpenStruct
    def initialize(resource:)
      @resource = sanitize_resource(resource)
    end

    private

    def sanitize_resource(resource)
      return to_open_struct(resource).data if resource.keys.any? { |key| [:data, 'data'].include?(key) }

      to_open_struct(resource)
    end

    def to_open_struct(data)
      JSON.parse(data.to_json, object_class: OpenStruct)
    end
  end
end

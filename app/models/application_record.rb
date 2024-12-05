class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true
  before_save :check_attributes

  private
    def check_attributes
      self.attributes.each do |attr_name, attr_value|
        if attr_value == "null"
          self[attr_name] = ""   
        end
      end
    end
end

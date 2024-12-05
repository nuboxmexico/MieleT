class FileResource < ApplicationRecord
  include ActionView::Helpers
  include ActionDispatch::Routing
  include Rails.application.routes.url_helpers
  ## Services
  scope :downloads, -> { where(object_source: "DataDownload")}
 
  has_one_attached :resource

  attribute :resource_url
  def resource_url
    url =  (self.resource.try(:attachment).try(:service_url)) rescue "" 
    url 
  end
end

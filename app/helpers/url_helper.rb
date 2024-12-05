module UrlHelper
  URL = Rails.configuration.site_url

  def url_edit_service(customer_id:, object_id:)
    path = "/customers/#{customer_id}/services/#{object_id}/edit_service"
    URL + path
  end
end

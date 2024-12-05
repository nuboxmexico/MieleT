
class PaymentMethod < ApplicationRecord
    belongs_to :country, optional: true
    attribute :logo_url

    def logo_url
        URI.join(Rails.application.config.site_url, ActionController::Base.helpers.asset_url("logo/payment_methods/#{self.logo}.png")) rescue ""
    end

    def self.search(country)
        country = Country.where("lower(iso) ilike ? ", "%#{country.try(:downcase)}%").try(:take)
        payments_methods = PaymentMethod.where(country_id: country.try(:id))
    end
end

require 'rails_helper'

RSpec.describe Gateway::WebpayGateway, type: :model do
    let(:payment){create(:payment)}
    it "check gateway methods" do
        provider = Gateway::WebpayGateway.new
        provider.actions
        provider.auto_capture?
        provider.source_required?
        provider.supports?("source")
        provider.provider_class
        provider.method_type
        provider.can_capture?(payment)
        provider.provider
        Gateway::WebpayGateway.STATE
        provider.purchase(1000, {}, options = {})
        provider.capture(100, 200, {})
        webpay_results = provider.confirmation "token_tbk", "request.base_url.to_s"
        provider.perform_payment(payment.id, "accepted")
        provider.perform_payment(payment.id, "rejected")
        provider.check_payment(payment.object_id)
        provider.check_payment(payment.id)
        payment.status = "paid"
        payment.save
        provider.check_payment(payment.object_id)
        
    end
end

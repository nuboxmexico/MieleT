require 'rails_helper'

RSpec.describe PaymentMethod, type: :model do
  it "check payment methods" do
    country_cl = build :country_cl
    country_cl.save!
    country_mx = build :country
    country_mx.save!
    mx = Country.find_or_create_by(name: "México", iso: "MX")
    cl = Country.find_or_create_by(name: "Chile", iso: "CL")

    PaymentMethod.find_or_create_by(name: "WebPay", provider: "webpay", logo: "webpay", country_id: cl.id)
    PaymentMethod.find_or_create_by(name: "American Express", provider: "american express", logo: "amex", country_id: mx.id)
    ## AMEX TEST CARDS
    ## N: 345678901234564
    ## VCTO: 01 / 39
    ## CSC/CVV: 0000
    ## NOMBRE: Cualquiera.
    ## https://evopaymentsmexico.gateway.mastercard.com/api/documentation/integrationGuidelines/supportedFeatures/testAndGoLive.html?locale=es_MX
    PaymentMethod.find_or_create_by(name: "EVO Payments", provider: "visa|mastercard", logo: "evopayments", country_id: mx.id)


    expect(PaymentMethod.search("CL").size).to eq 1
    expect(PaymentMethod.search("MX").size).to eq 2
    expect(PaymentMethod.last.logo_url).should_not be_nil
  end
end

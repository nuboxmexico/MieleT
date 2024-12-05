FactoryBot.define do
  factory :payment_method do
    name { "WebPay" }
    provider { "webpay" }
    logo { "webpay" }
    country factory: :country_cl
  end
end

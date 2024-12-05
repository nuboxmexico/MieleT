FactoryBot.define do
  factory :payment do
    user factory: :user
    customer_id { "34" }
    object_id { "1" }
    object_class { "1" }
    amount { 1.5 }
    status { "pedding" }
    token_ws { "123awda124dsaxsa" }
    provider_params { "{}" }
    transaction_id { "12124MNWJAKDW" }
    payment_method factory: :payment_method
  end
end

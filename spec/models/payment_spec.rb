require 'rails_helper'

RSpec.describe Payment, type: :model do
  let(:payment){create(:payment)}
  it "check payment methods" do
    payment.payment_method_name
    payment.generate_transaction_id
    payment.webpay?
    expect(payment.generate_transaction_id).should_not be_nil
  end
end

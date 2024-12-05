class AddPaymentMethodToPayment < ActiveRecord::Migration[6.0]
  def change
    add_reference :payments, :payment_method, foreign_key: true
  end
end

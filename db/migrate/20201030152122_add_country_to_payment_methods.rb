class AddCountryToPaymentMethods < ActiveRecord::Migration[6.0]
  def change
    add_reference :payment_methods, :country, null: false, foreign_key: true
  end
end

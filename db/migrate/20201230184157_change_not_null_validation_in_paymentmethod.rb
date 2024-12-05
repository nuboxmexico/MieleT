class ChangeNotNullValidationInPaymentmethod < ActiveRecord::Migration[6.0]
  def change
	change_column_null :payment_methods, :country_id, true	
  end
end

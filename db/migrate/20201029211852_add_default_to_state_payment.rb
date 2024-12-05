class AddDefaultToStatePayment < ActiveRecord::Migration[6.0]
  def change
	change_column :payments, :status, :string, default: "pending"
  end
end

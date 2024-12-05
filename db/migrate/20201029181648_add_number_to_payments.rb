class AddNumberToPayments < ActiveRecord::Migration[6.0]
  def change
    add_column :payments, :number, :string
  end
end

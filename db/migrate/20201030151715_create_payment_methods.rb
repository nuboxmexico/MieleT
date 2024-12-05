class CreatePaymentMethods < ActiveRecord::Migration[6.0]
  def change
    create_table :payment_methods do |t|
      t.string :name
      t.string :provider
      t.string :logo

      t.timestamps
    end
  end
end

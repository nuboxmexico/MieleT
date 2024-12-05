class CreatePayments < ActiveRecord::Migration[6.0]
  def change
    create_table :payments do |t|
      t.references :user, foreign_key: true
      t.string :customer_id
      t.string :object_id
      t.string :object_class
      t.float :amount
      t.string :status
      t.string :token_ws
      t.text :provider_params
      t.string :transaction_id

      t.timestamps
    end
  end
end

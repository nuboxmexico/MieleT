class CreateTechnicians < ActiveRecord::Migration[6.0]
  def change
    create_table :technicians do |t|
      t.string :n_store
      t.references :user, null: false, foreign_key: true
      t.string :vehicle_info
      t.string :vehicle_license

      t.timestamps
    end
  end
end

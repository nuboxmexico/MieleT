class CreateTechnicianZipcodes < ActiveRecord::Migration[6.0]
  def change
    create_table :technician_zipcodes do |t|
      t.references :technician, null: false, foreign_key: true
      t.references :zipcode, null: false, foreign_key: true

      t.timestamps
    end
  end
end

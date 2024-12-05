class CreateTechnicianTaxons < ActiveRecord::Migration[6.0]
  def change
    create_table :technician_taxons do |t|
      t.references :technician, null: false, foreign_key: true
      t.integer :taxon_id
      t.string :taxon_type

      t.timestamps
    end
  end
end

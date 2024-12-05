class AddTaxonNameToTechnicianTaxon < ActiveRecord::Migration[6.0]
  def change
    add_column :technician_taxons, :taxon_name, :string
  end
end

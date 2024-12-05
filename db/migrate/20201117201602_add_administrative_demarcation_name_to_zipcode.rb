class AddAdministrativeDemarcationNameToZipcode < ActiveRecord::Migration[6.0]
  def change
    add_column :zipcodes, :administrative_demarcation_name, :string
  end
end

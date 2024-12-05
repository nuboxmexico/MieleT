class AddEnterpriseToTechnician < ActiveRecord::Migration[6.0]
  def change
    add_column :technicians, :enterprise, :string
  end
end

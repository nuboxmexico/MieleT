class AddDescriptionToDataUpload < ActiveRecord::Migration[6.0]
  def change
    add_column :data_downloads, :description, :string
  end
end

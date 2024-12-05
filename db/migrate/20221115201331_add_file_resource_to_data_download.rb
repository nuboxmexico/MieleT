class AddFileResourceToDataDownload < ActiveRecord::Migration[6.0]
  def change
    add_reference :data_downloads, :file_resource,  foreign_key: true
  end
end

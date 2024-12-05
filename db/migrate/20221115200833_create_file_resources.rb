class CreateFileResources < ActiveRecord::Migration[6.0]
  def change
    create_table :file_resources do |t|
      t.string :name
      t.string :object_source
      t.string :mime
      t.string :description

      t.timestamps
    end
  end
end

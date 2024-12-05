class CreateDataDownloads < ActiveRecord::Migration[6.0]
  def change
    create_table :data_downloads do |t|
      t.string :data_type
      t.references :user, null: false, foreign_key: true
      t.string :errors_body
      t.boolean :finished

      t.timestamps
    end
  end
end

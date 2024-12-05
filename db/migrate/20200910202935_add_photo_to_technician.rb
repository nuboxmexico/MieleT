class AddPhotoToTechnician < ActiveRecord::Migration[6.0]
  def change
    add_column :technicians, :photo, :string
  end
end

class CreateTechnicianActivities < ActiveRecord::Migration[6.0]
  def change
    create_table :technician_activities do |t|
      t.references :technician, null: false, foreign_key: true
      t.references :activity, null: false, foreign_key: true

      t.timestamps
    end
  end
end

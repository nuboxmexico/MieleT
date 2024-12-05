class AddJobsCountToTechnicians < ActiveRecord::Migration[6.0]
  def change
    add_column :technicians, :jobs_count, :integer, default: 0
  end
end

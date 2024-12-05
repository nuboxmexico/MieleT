class AddSurnameCellphonePhoneCostCenterRoleIdWorktimeToUser < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :surname, :string
    add_column :users, :cellphone, :string
    add_column :users, :phone, :string
    add_column :users, :cost_center, :string
    add_column :users, :role_id, :string
    add_column :users, :worktime, :string
  end
end

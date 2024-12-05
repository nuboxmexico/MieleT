class AddFromAuthToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :from_auth, :string, default: ""
  end
end

class Country < ApplicationRecord
    has_many :user_countries, dependent: :destroy
    has_many :users, through: :user_countries
end

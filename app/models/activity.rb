class Activity < ApplicationRecord
    has_many :technician_activities
	has_many :technicians, through: :technician_activities
end

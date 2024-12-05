require 'rails_helper'

RSpec.describe UserNotification, type: :model do
    let(:user){create(:user)}
    before :each do
        @service_params = {
            customer_id: "1",
            address: "principal",
            service_type: "Instalación",
            subcategory: "Domestica",
            requested: "requested",
            request_channel: "request_channel",
            distributor_name: "distributor_name",
            distributor_email: "distributor_email",
            technicians_number: "2",
            hour_amount: "100",
            fee_amount: "100",
            total_hours: "100",
            total_amount: "100",
            status: "pending",
            background: "background",
            no_payment: false,
            payment_channel: "payment_channel",
            payment_date: Date.today,
            no_payment_reason: "no_payment_reason",
            invoice: false,
            customer_products_id: "1"
        }
    end
      
    it "check methods" do

      user.created_at
      user.updated_at
      user.generate_api_key
      user.save
    
      @customer_service = ApiSingleton.service_api(@service_params)["data"][0]
      UserNotification.notify_service_visit_prescheduled(@customer_service, "service")

      @customer_visit = @customer_service["last_visit"]
      UserNotification.notify_service_visit_prescheduled(@customer_visit, "visit")

      complaint = {
        "id": "1",
        "number": "TESTMX00001",
        "channel": "TESTchannel",
        "service" => {
            "number": "TESTMX00001"
        },
        "customer_id": "1"
      }

      UserNotification.notify_complaint_create(complaint)
      
      complaint["stage"] = "first_proposal"
      
      UserNotification.notify_complaint_update(complaint)
      
      complaint["stage"] = "scale_complaint"
     
      UserNotification.notify_complaint_update(complaint)
      
    end
end

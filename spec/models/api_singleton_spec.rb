require 'rails_helper'

RSpec.describe ApiSingleton, type: :model do
    let(:payment){create(:payment)}
    it "check api singleton methods" do
        service_params = {
            id: "1",
            customer_id: "34",
            service_id: "1",
            address: "principal",
            service_type: "Instalación",
            subcategory: "Profecional",
            requested: "requested",
            request_channel: "Online",
            distributor_name: "",
            distributor_email: "",
            customer_products_id: "1,2",
            technicians_number: "2",
            hour_amount: "1000",
            fee_amount: "690",
            total_hours: "2",
            total_amount: "1690",
            status: "pendding",
            background: "Test",
            no_payment: "false",
            payment_channel: "Teléfono",
            payment_date: "22/12/2020",
            no_payment_reason: "",
            invoice: "true",
            event_start: "22/12/2020",
            event_end: "23/12/2020",
            technicians_ids: "1,2",
            images: "[]",
        }
        response = ApiSingleton.get_update_customer_service_api(service_params)
        expect(response["id"]).should_not be_nil
        
        response = ApiSingleton.create_technician_events_api("1", "CL", "{}")
        expect(response["id"]).should_not be_nil
        
        response = ApiSingleton.destroy_technician_calendar_events("22/12/2020", "23/12/2020", "1")
        expect(response["id"]).should_not be_nil

        response = ApiSingleton.service_prices_api("CL", "1,2,3", "Instalación")
        expect(response["id"]).should_not be_nil
        
        response = ApiSingleton.destroy_file_resource_api("1")
        expect(response["id"]).should_not be_nil

        customer_products_service_spare_parts_params = {
            customer_product_id: "1",
            customer_products_service_spare_parts_params: "1"
        }
        response = ApiSingleton.get_customer_products_product_requested_spare_parts(customer_products_service_spare_parts_params)
        expect(response).should_not be_nil

        check_params = {
            customer_product_ids: "1",
            visit_id: "1"
        }
        response = ApiSingleton.get_customer_products_getCheckStates(check_params) 
        expect(response).should_not be_nil

        customer_policy_params = {
            customer_id: "1",
            policy_id: "1"
        }
        response = ApiSingleton.get_destroy_customer_policy_api(customer_policy_params) 
        expect(response).should_not be_nil
        
        customer_policy_params = {
            customer_id: "1",
            policy_id: "1",
            payment_files: []
        }
        response = ApiSingleton.get_validate_policy_payment_api(customer_policy_params) 
        expect(response).should_not be_nil
        

        response = ApiSingleton.customer_complaints_api("1") 
        expect(response).should_not be_nil

        
        customer_complaints_params = {
            id: "1",
            complaint_id: "1", 
            service_id: "1", 
            complaint_type: "complaint_type", 
            channel: "channel", 
            phone: "phone", 
            complaint_background: "complaint_background", 
            compensation_proposal: "compensation_proposal", 
            closure_details: "closure_details", 
            compensation_proposal_2: "compensation_proposal_2", 
            closure_details_2: "closure_details_2", 
            stage: "stage"
        }
        
        response = ApiSingleton.create_customer_complaint_api(customer_complaints_params) 
        expect(response).should_not be_nil

        
        
        response = ApiSingleton.update_customer_complaint_api(customer_complaints_params) 
        expect(response).should_not be_nil


        response = ApiSingleton.get_products_by_tnr_api("TEST", "CL") 
        expect(response).should_not be_nil


           
        response = ApiSingleton.service_status_changes_api(service_params)
        expect(response).should_not be_nil

        
        response = ApiSingleton.service_status_label_api(service_params)
        expect(response).should_not be_nil

        visit_params = {
            id: "1",
            visit_id: "1", 
            service_id: "1", 
            cancel_from: "cancel_from", 
            cancel_reason: "cancel_reason"
        }

        response = ApiSingleton.get_cancel_service_visit_api(visit_params)
        expect(response).should_not be_nil

        response = ApiSingleton.services_customer_complaints_api("1")
        expect(response).should_not be_nil

        create_visit_params = {
            service_id: "1",
            customer_id: "customer_id",
            service_id: "service_id",
            visit_id: "visit_id",
            address: "address",
            address_fn: "address_fn",
            service_type: "service_type",
            subcategory: "subcategory",
            requested: "requested",
            request_channel: "request_channel",
            distributor_name: "distributor_name",
            distributor_email: "distributor_email",
            customer_products_id: "customer_products_id",
            technicians_number: "technicians_number",
            hour_amount: "hour_amount",
            fee_amount: "fee_amount",
            labor_amount: "labor_amount",
            viatic_amount: "viatic_amount",
            subtotal_amount: "subtotal_amount",
            iva_amount: "iva_amount",
            total_hours: "total_hours",
            total_amount: "total_amount",
            status: "status",
            background: "background",
            no_payment: "no_payment",
            payment_channel: "payment_channel",
            payment_date: "payment_date",
            no_payment_reason: "no_payment_reason",
            invoice: "invoice",
            event_start: "event_start",
            event_end: "event_end",
            technicians_ids: "technicians_ids",
            images: "images",
            payment_state: "payment_state",
            consumables: "consumables",
            customer_payment_date: "customer_payment_date",
            from: "from",
            policy_id: "policy_id",
        }
        response = ApiSingleton.get_cancel_service_visit_api(create_visit_params)
        expect(response).should_not be_nil


        quotations_params = {
            id: "1",
            save_type: "save_type",
            tm_background: "tm_background",
            cs_background: "cs_background",
            customer_background: "customer_background",
            customer_product_warranties: "si",
            spare_parts_amount: "123",
            labor_amount: "123",
            viatic_amount: "123",
            subtotal_amount: "123",
            iva_amount: "123",
            total_amount: "123"
        }

        response = ApiSingleton.get_update_quotation_api(quotations_params, "person_accountable")
        expect(response).should_not be_nil


        response = ApiSingleton.get_validate_payment_quotation_api(quotations_params)
        expect(response).should_not be_nil


        service_spare_part_params = {
            id: "1",
            products: "1",
            customer_product_id: "1",
            status: "status",

        }
        response = ApiSingleton.get_create_quotation_spare_parts_api(service_spare_part_params)
        expect(response).should_not be_nil

        quotation_spare_part_params = {
            id: "1",
            quotation_spare_part_id: "1",
            quantity: "1",
            from: "from",
            requested_quantity: "1",
            status: "status",
            warranty: "NO",
            price: "21312",
        }
        
        response = ApiSingleton.get_update_quotation_spare_parts_api(quotation_spare_part_params)
        expect(response).should_not be_nil
        
        response = ApiSingleton.destroy_quotation_spare_part_api("1", "1", "")
        expect(response).should_not be_nil



        response = ApiSingleton.viatic_values_api("CL", "TEST")
        expect(response).should_not be_nil

        
        response = ApiSingleton.file_resources_api("1")
        expect(response).should_not be_nil


        response = ApiSingleton.check_list_file_resources_api("1")
        expect(response).should_not be_nil

        response = ApiSingleton.survey_questions_api
        expect(response).should_not be_nil

        survey_questions_params = {
            service_id: "1",
            survey_id: "1",
            answers: "test",
            status: "test",
            background: "test",    
        }
        response = ApiSingleton.get_survey_answers_api(survey_questions_params)
        expect(response).should_not be_nil

        
    end
end

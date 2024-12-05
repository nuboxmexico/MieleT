
require 'rails_helper'
RSpec.describe Api::V1::CustomersController, type: :controller do
    describe "methods" do
        let(:user){create(:user)}

        before :each do
            @request.env["devise.mapping"] = Devise.mappings[:user]
            sign_in user
            @params = {:id => 1 ,format: :json}
          

            @customer_product_additional_params = {
                customer_id: "1",
                business_unit: "business_unit",
                family: "family",
                subfamily: "subfamily",
                product_name: "product_name"
            }

        end
        

        
        it "update a customer product" do

            @params[:customer_id] = 1
            @params[:customer_product_id] = 1
            @params[:id] = "TESTID"
            @params[:tnr] = "MyString"
            @params[:business_unit] = "BU"
            @params[:family] = "Family"
            @params[:subfamily] = "Subfamily"
            @params[:specific] = "specify"
            @params[:product_name] = "Nombre del producto"
            post :update_product, params: @params
            expect(response.status).to eq(200)

        end


        it "destroy a customer product" do

            @params[:customer_id] = 1
            @params[:customer_product_id] = 1
            delete :delete_product, params: @params
            expect(response.status).to eq(400)

        end
        
        it "assign_product_spare_parts customer product" do

            @params[:id] = 1
            @params[:service_spare_part_ids] = 1
            @params[:quantities] = "1"
            @params[:warranties] = "Si"
            post :assign_product_spare_parts, params: @params
            expect(response.status).to eq(200)

        end

        it "assign_product_spare_parts customer product" do

            @params[:id] = 1
            @params[:customer_product_service_spare_part_ids] = 1
            @params[:quantities] = "1"
            post :reintegrate_product_spare_parts, params: @params
            expect(response.status).to eq(200)

        end

        it "customer_product_used_spare_parts" do
            params = {id: "1",  format: :json}
            get :customer_product_used_spare_parts, params: params
            expect(response.status).to eq(200)
        end

        
        
    end
end
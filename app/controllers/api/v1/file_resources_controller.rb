class Api::V1::FileResourcesController < ApplicationController
    protect_from_forgery with: :null_session, only: [:destroy, :visit_product_images, :checklist_product_images]
    skip_before_action :authenticate_user!, only: [:destroy, :visit_product_images, :checklist_product_images]
    include ActionController::HttpAuthentication::Token::ControllerMethods
    before_action :authenticate, only: [:destroy, :visit_product_images, :checklist_product_images]
	
    api :DELETE, "/v1/file_resources/:id", "Elimina un archivo en particular"
    param :id, String, :desc => "ID del archivo a eliminar" 
    example "Request: "+Rails.application.config.site_url+"/api/v1/customers/1/customer_product/1\n
    Salida:
        { file_resource_id: 1, message: 'File resource deleted!' }
    "
    def destroy
        @file_resource =  ApiSingleton.destroy_file_resource_api(params[:id])
        
        
        if (@file_resource["file_resource_id"] rescue false)
            puts "Archivo eliminado"
            puts @file_resource.inspect
            render json: @file_resource.to_json
        else
            render json: @file_resource, status: :bad_request
        end
    end

    api :GET, "/v1/file_resources/:id/visit_customer_products", "Lista los archivos de un servicio"
    param :id, String, :desc => "ID del producto de la visita a consultar" 
	
    def visit_product_images
        response = {}
        file_resources = ApiSingleton.file_resources_api(params[:id])
	    render json:  file_resources.to_json
    end


    api :GET, "/v1/file_resources/:id/checklist_product_images", "Lista los archivos de un producto en un checklist"
    param :id, String, :desc => "ID del producto de la checklista a consultar" 
	
    def checklist_product_images
        response = {}
        file_resources = ApiSingleton.check_list_file_resources_api(params[:id])
	    render json:  file_resources.to_json
    end


    
end
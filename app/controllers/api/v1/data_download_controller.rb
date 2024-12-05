class Api::V1::DataDownloadController < ApplicationController
	protect_from_forgery with: :null_session
    skip_before_action :authenticate_user!
    include ActionController::HttpAuthentication::Token::ControllerMethods
    before_action :authenticate

	before_action :set_user, only: [:show, :edit, :update, :destroy, :notifications, :notification_read, :notifications_unread]
	after_action :send_welcome_email, only: [:create]
	after_action :save_roles, only: [:create, :update]
	after_action :save_countries, only: [:create, :update]
	
	api :GET, "/v1/downloads", "Retorna los usuarios filtrados y paginados"
    param :page, String, :desc => "Pagina consultada 1..n"
    param :per_page, String, :desc => "Resultados por paǵina esperados"
	param :keywords, String, :desc => "Filtro de texto para encontrar al usuario"
	example "Request: "+Rails.application.config.site_url+"/api/v1/downloads?page=2\n
	Salida:
        {
            page: 2,
            per_page: 10,
            data: [
                {... user},
                {... user},
                {... user},
                {... user},
                {... user},
                {... user},
                {... user},
                {... user},
                {... user},
                {... user}
            ],
            total: 48
        }
	"
	def index
		response = {}
	    response["page"] = params[:page].blank? ? 1 : params[:page].to_i
	    response["per_page"] = params[:per_page].blank? ? 10 : params[:per_page].to_i
	    downloads = DataDownload.all.order(created_at: :desc).paginate(page: params[:page], per_page: params[:per_page])
		response["data"] = downloads
	    response["total"] = downloads.total_entries
	    render json:  response.to_json(include: [:user, :file_resource])
  	end

end

class DataDownloadController < ApplicationController
	load_and_authorize_resource
	
    def download_zipcodes
		send_data DataDownload.download_zipcodes(params[:technician_id]).to_stream.read, type: "application/xlsx", filename: "Zipcodes_#{Date.today.strftime("%d-%m-%Y")}.xlsx"
	end

end


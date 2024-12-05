class DataDownload < ApplicationRecord
  belongs_to :user
  belongs_to :file_resource, optional: true
  def self.download_zipcodes(technician_id)
		zipcodes = Axlsx::Package.new
		zipcodes.use_autowidth = true
		wb = zipcodes.workbook
		zipcodes_cl = Technician.find_by(id: technician_id).zipcodes.where(zip: nil)
		zipcodes_mx = Technician.find_by(id: technician_id).zipcodes.where(administrative_demarcation_name: nil)
		title = wb.styles.add_style(:b=> true, :sz=>12, :border=> {:style => :thin, :color => "00000000",:edges => [:top,:left, :right, :bottom]})
		wb.add_worksheet(name: "México") do |sheet|
            headers = ["Código Postal",	"Borrar"]
			sheet.add_row headers, style: title
			if zipcodes_mx.size > 0
				zipcodes_mx.each do |zip|
					row_t = [zip.try(:zip), ""]
					sheet.add_row row_t
				end
			end
		end
		wb.add_worksheet(name: "Chile") do |sheet|
			headers = ["Comunas","Borrar"]
            
			sheet.add_row headers, style: title
			if zipcodes_cl.size > 0
				zipcodes_cl.each do |zip|
					row_t = [zip.try(:administrative_demarcation_name), ""]
					sheet.add_row row_t
				end
			end
		end
		zipcodes
	end
end

class DataDownloadWorker
    include Sidekiq::Worker
    require 'roo'
    sidekiq_options retry: false

    def perform(start_date, finish_date, data_download_id)
        i = 1
        data_download = DataDownload.find_by_id(data_download_id)

        ###########################################
        ### Bloque para dividir las fechas en meses
        #group_of_dates = (Date.parse(start_date)..Date.parse(finish_date)).group_by(&:month).map do |group|
        #[group.last.first.beginning_of_month.to_s, group.last.last.end_of_month.to_s]
        #end
        ###########################################
        
        
        ###########################################
        ### Bloque para dividir las fechas en semanas
        group_of_dates =  (Date.parse(start_date)..Date.parse(finish_date).end_of_week).select(&:sunday?).map do |group|
          [group.beginning_of_week.to_s, group.end_of_week.to_s]
        end
        ###########################################
        
        group_of_dates.first[0] = Date.parse(start_date).to_s
        group_of_dates.last[1] = Date.parse(finish_date).to_s


        @services_all = []

        group_of_dates.each do |date_month|
        services = begin
            ApiSingleton.services_with_extended_info_api('', '', '', false, date_month.first, date_month.last)['data']
            rescue StandardError
            []
            end
            if services.length != 0
            services.each do |service|
                service_aux = service
                technicians_ids = begin
                service_aux['calendar_events'].collect do |calendar_events|
                    calendar_events['object_id']
                end
            rescue StandardError
                []
            end
            principal_technician = Technician.where(id: technicians_ids[0]).take
            service_aux['principal_technician_name'] = principal_technician.user.fullname if principal_technician
            @services_all.push(service_aux)
            end
            i += 1
        end
        end
        get_service_details(@services_all)
        # render del excel pa que se descargue, esto redirecciona a la vista

        xlsx = ApplicationController.new.render_to_string layout: false, template: "api/v1/services/services_report_excel.xlsx.axlsx", locals: { services_all: @services_all }
        file = FileResource.create(name: "Servicios #{Date.today.strftime('%d-%m-%Y')}.xlsx", object_source: "DataDownload", mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        data_download.update(file_resource_id: file.id, finished: true)
        file.resource.attach(io: StringIO.new(xlsx), filename: 'file.xlsx', content_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        
    end

    private

    def get_service_details(services)
        i = 0
        services.each do |service|
          payment_data = Payment.where(object_id: service['id'], object_class: 'Servicio').order(id: :desc)
          service['payment_data'] = payment_data[0] unless payment_data.empty?
          principal_technician_name = '-'
          unless service['principal_technician'].blank?
            technician = Technician.find_by_id(service['principal_technician']).try(:user)
            principal_technician_name = technician['fullname'] if technician
          end
          service['principal_technician_name'] = principal_technician_name
          service['visits'].each do |visit|
            visit['customer_products'].each do |product|
              requested_spare_parts = []
              used_spare_parts = []
              quotation_aux = false
              service['quotations'].each do |q|
                quotation_aux = q if q['quotation_number'] == visit['visit_number']
                next unless quotation_aux
    
                quotation_payment_data = Payment.where(object_id: quotation_aux['id'],
                                                       object_class: 'Cotizacion').order(id: :desc)
                quotation_aux['payment_data'] = quotation_payment_data[0] unless quotation_payment_data.empty?
                quotation_aux['requested_spare_parts'].each do |request|
                  requested_spare_parts.push(request) if request['customer_product_id'] == product['id']
                end
                quotation_aux['used_spare_parts'].each do |request|
                  used_spare_parts.push(request) if request['customer_product_id'] == product['id']
                end
                # service["quotations"][0]["spare_parts_amount"] = spare_parts_amount
                visit['quotation'] = quotation_aux
                # raise quotation_aux.inspect
              end
    
              product['requested_spare_parts'] = requested_spare_parts
              product['used_spare_parts'] = used_spare_parts
            end
          end
        end
    end
    
end

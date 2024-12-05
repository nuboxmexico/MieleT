class Service
  def self.send_spare_parts_request_notification(service_id)
    service = ApiSingleton.service_api({ id: service_id })
    if service['quotation_status'] == 'Solicitud en tránsito' && service['request_in_transit_notification'] == false && (service.present? && service['customer']['push_notification_token'].present?)
      message = {
        title: 'Solicitud de refacciones',
        body: "Debido a que no se encuentran disponibles algunas de las refacciones requeridas para el servicio Folio #{service['number']} se solicitó su importación, lo cual puede tomar de 1 a 2 meses, un ejecutivo de CC irá comunicando los avances."
      }
      data = {
        folio: service_id
      }
      response = ApiSingleton.create_push_notification({ message: message, data: data,
                                                         token: service['customer']['push_notification_token'],
                                                         customer_id: service['customer']['id'] })
      begin
        PushNotifications.send_message(
          service['customer']['push_notification_token'], message, data, response['unreaded']
        )
      rescue StandardError
        puts 'Fallo envio de notificacion'
      end
    end
  end

  def self.send_spare_parts_arrival_notification(service_id)
    service = ApiSingleton.service_api({ id: service_id })
    message = {
      title: 'Llegada de Refacciones',
      body: "Folio [#{service['number']}] se encuentra listo para agendar la nueva visita requerida"
    }
    data = {
      folio: service_id
    }
    response = ApiSingleton.create_push_notification({ message: message, data: data,
                                                       token: service['customer']['push_notification_token'],
                                                       customer_id: service['customer']['id'] })
    PushNotifications.send_message(
      service['customer']['push_notification_token'], message, data, response['unreaded']
    )
  end

  def self.find(id); end
end

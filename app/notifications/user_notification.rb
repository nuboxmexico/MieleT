# To deliver this notification:
#
# UserNotification.with(post: @post).deliver_later(current_user)
# UserNotification.with(post: @post).deliver(current_user)

class UserNotification < Noticed::Base
  # Add your delivery methods
  #
  #@notification.mark_as_read!
  #@notification.mark_as_unread!
  deliver_by :database
  # deliver_by :email, mailer: "UserMailer"
  # deliver_by :slack
  # deliver_by :custom, class: "MyDeliveryMethod"

  # Add required params
  #
  # param :post

  # Define helper methods to make rendering easier.
  #
  # def message
  #   t(".message")
  # end
  #
  # def url
  #   post_path(params[:post])
  # end
#

  def self.notify_service_visit_prescheduled(notification_object, notification_type)

    if notification_type == "service"
      users = User.joins(:roles).where("roles.name = 'Field Service' OR roles.name = 'Technical Management' OR roles.name = 'Administrador' ")
      customer_id = notification_object["customer_id"]
      service_id = notification_object["id"]
      service_number = notification_object["number"]
      notification_check = notification_object["is_presheduled"]
    else
      users = User.joins(:roles).where("roles.name = ? OR roles.name = 'Administrador'", "Field Service")
      customer_id = notification_object["customer_id"]
      service_id = notification_object["service_id"]
      service_number = notification_object["service_number"]
      notification_check = (notification_object["status"] != "new")
    end
    if notification_check
      notification = UserNotification.with(
        data: {
            id: "service_visit_#{service_id}",
            name: "#{service_number} - Ingreso de nuevo servicio/visita",
            description: "Revisión requerida por Technical Management o Field Service",
            link: "/customers/#{customer_id}/services/#{service_id}/edit_service"
            }   
        ) 
      users.each do |user|
        notification.deliver_later(user)   
      end
    end
  end

  def self.notify_revised_service(customer_service)
    notification = UserNotification.with(
      data: {
          id: "revised_service_#{customer_service["id"]}",
          name: "#{customer_service["number"]} - Revisión de visita completada por Technical Management",
          description: "Se debe realizar auditoría por Field Service",
          link: "/customers/#{customer_service["customer_id"]}/services/#{customer_service["id"]}/edit_service"
          }
      )

      users = User.joins(:roles).where("roles.name = ? OR roles.name = 'Administrador'", "Field Service")
      users.each do |user|
        notification.deliver_later(user)   
      end
  end

  def self.notify_paid_quotation(customer_service)
    notification = UserNotification.with(
      data: {
          id: "paid_quotation_#{customer_service["id"]}",
          name: "#{customer_service["number"]} - Pago de cotización validado",
          description: "Se debe realizar solicitud de refacciones correspondientes por Field Service",
          link: "/customers/#{customer_service["customer_id"]}/services/#{customer_service["id"]}/edit_service"
          }
      )
      users = User.joins(:roles).where("roles.name = ? OR roles.name = 'Administrador'", "Field Service")
      users.each do |user|
        notification.deliver_later(user)   
      end
  end

  def self.notify_audit_completed(customer_service)
    notification = UserNotification.with(
      data: {
          id: "audit_completed_#{customer_service["id"]}",
          name: "#{customer_service["number"]} - Servicio completado al 100%",
          description: "Se debe finalizar el servicio y contactar a cliente para encuesta por Contact Center",
          link: "/customers/#{customer_service["customer_id"]}/services/#{customer_service["id"]}/edit_service"
          }
      )
      users = User.joins(:roles).where("roles.name = ? OR roles.name = 'Administrador'", "Contact Center")
      users.each do |user|
        notification.deliver_later(user)   
      end
  end

  def self.notify_audit_concluded(customer_service)
    notification = UserNotification.with(
      data: {
          id: "audit_concluded_#{customer_service["id"]}",
          name: "#{customer_service["number"]} - Refacciones y/o Técnico principal de servicio listo",
          description: "Agendamiento de servicio o nueva visita requerida por Contact Center",
          link: "/customers/#{customer_service["customer_id"]}/services/#{customer_service["id"]}/edit_service"
          }
      )
      users = User.joins(:roles).where("roles.name = ? OR roles.name = 'Administrador'", "Contact Center")
      users.each do |user|
        notification.deliver_later(user)   
      end
  end

  def self.notify_visit_completed(customer_service)
    notification = UserNotification.with(
      data: {
          id: "visit_completed_#{customer_service["id"]}",
          name: "#{customer_service["number"]} - Visita concluida por Técnico",
          description: "Se debe realizar Auditoría por Technical Management",
          link: "/customers/#{customer_service["customer_id"]}/services/#{customer_service["id"]}/edit_service"
          }
      )
      users = User.joins(:roles).where("roles.name = ? OR roles.name = 'Administrador'", "Technical Management")
      users.each do |user|
        notification.deliver_later(user)   
      end
  end


  def self.notify_service_prediagnosis_submit(customer_service)
    notification = UserNotification.with(
      data: {
          id: "service_prediagnosis_#{customer_service["id"]}",
          name: "#{customer_service["number"]} - Pre-Diagnóstico completado por Technical Management",
          description: "Revisión requerida por Field Service",
          link: "/customers/#{customer_service["customer_id"]}/services/#{customer_service["id"]}/edit_service"
          }
      )

      users = User.joins(:roles).where("roles.name = ? OR roles.name = 'Administrador'", "Field Service")
      users.each do |user|
        notification.deliver_later(user)   
      end

  end


  def self.notify_complaint_create(complaint)
    notification = UserNotification.with(
      data: {
          id: "complaint_#{complaint["id"]}",
          name: "#{complaint["number"]} - Queja de servicio pendiente",
          description: "Revisión requerida por #{complaint["channel"]}, Servicio: #{complaint["service"]["number"]}",
          link: "/customers/#{complaint["customer_id"]}/show"
          }
      )

      users = User.joins(:roles).where("roles.name = ? OR roles.name = 'Administrador'", complaint["channel"])
      users.each do |user|
        notification.deliver_later(user)   
      end

  end


  def self.notify_complaint_update(complaint)
    if(complaint["stage"] == "first_proposal" || complaint["stage"] == "second_proposal")
      notification = UserNotification.with(
        data: {
            id: "complaint_first_proposal_#{complaint["id"]}",
            name: "#{complaint["number"]} - Ingreso de propuesta de compensación de una Queja",
            description: "Revisión requerida por Contact Center, Servicio: #{complaint["service"]["number"]}",
            link: "/customers/#{complaint["customer_id"]}/show"
            }
        )
  
      users = User.joins(:roles).where("roles.name = ? OR roles.name = 'Administrador'", "Contact Center")
      users.each do |user|
        notification.deliver_later(user)   
      end
    elsif(complaint["stage"] == "scale_complaint" || complaint["stage"] == "close_complaint")
      notification = UserNotification.with(
        data: {
            id: "complaint_#{complaint["id"]}",
            name: "#{complaint["number"]} - Queja de servicio pendiente",
            description: "Revisión requerida por #{complaint["channel"]}, Servicio: #{complaint["service"]["number"]}",
            link: "/customers/#{complaint["customer_id"]}/show"
            }
        )
  
        users = User.joins(:roles).where("roles.name = ? OR roles.name = 'Administrador'", complaint["channel"])
        users.each do |user|
          notification.deliver_later(user)   
        end
    end
  end

  def self.notify_instalation_required(customer_service)
    notification = UserNotification.with(
      data: {
          id: "paid_quotation_#{customer_service["id"]}",
          name: "#{customer_service["number"]} - Servicio de Instalación requerido",
          description: "Se debe contactar a cliente para iniciar el servicio",
          link: "/customers/#{customer_service["customer_id"]}/services/#{customer_service["id"]}/edit_service"
          }
      )
      users = User.joins(:roles).where("roles.name = ? OR roles.name = 'Administrador'", "Contact Center")
      users.each do |user|
        notification.deliver_later(user)   
      end
  end

  def self.notify_home_program_required(customer_service)
    notification = UserNotification.with(
      data: {
          id: "paid_quotation_#{customer_service["id"]}",
          name: "#{customer_service["number"]} - Servicio de Home Program requerido",
          description: "Se debe contactar a cliente para iniciar el servicio",
          link: "/customers/#{customer_service["customer_id"]}/services/#{customer_service["id"]}/edit_service"
          }
      )
      users = User.joins(:roles).where("roles.name = 'Administrador' OR roles.name = 'Contact Center' OR roles.name = 'Home Program'")
      users.each do |user|
        notification.deliver_later(user)
      end
  end
end

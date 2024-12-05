class DeviseMailer < Devise::Mailer
    layout 'mailer'
    default from: Rails.application.secrets.mail_admin
    before_action :set_attachments
    before_action :check_params
    def welcome_email(user)
        @user      = user
        mail(to: @user.email,
            subject: "Creación usuario Miele Tickets") do |format|
            format.html { render "devise/mailer/welcome_email_#{@user.country}" }
        end
    end

    def reset_password_instructions(record, token, opts={})
        opts[:subject] = '[Miele App Clientes] - Cambio de clave'
        super
    end

    private
        
        def check_params
            #@from = 
        end

        def set_attachments
        attachments.inline['logo-mini.png'] = File.read(Rails.root+'app/assets/images/logo/logo-mini.png')
      end
  end
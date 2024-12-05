class ApplicationMailer < ActionMailer::Base
  default from: Rails.application.secrets.mail_admin
  layout 'mailer'
  before_action :set_attachments

  private
  	def set_attachments
      attachments.inline['logo-mini.png'] = File.read(Rails.root+'app/assets/images/logo/logo-mini.png')
    end
end

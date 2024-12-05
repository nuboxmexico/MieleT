require "rails_helper"

RSpec.describe NotificationMailer, type: :mailer do
  it 'checl mailers ' do
    NotificationMailer.policy_email("test@email.com", "49", "9").deliver_now
    NotificationMailer.quotation_email("test@email.com", "24").deliver_now

  end
end

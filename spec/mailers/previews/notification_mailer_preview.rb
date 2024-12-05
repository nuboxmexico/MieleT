# Preview all emails at http://localhost:3000/rails/mailers/notification_mailer
class NotificationMailerPreview < ActionMailer::Preview
    def payment_email
        NotificationMailer.payment_email(User.first.email, "1969")
    end


    def visit_payment_email
        NotificationMailer.payment_email(User.first.email, "1969", "visit", "72")
    end

    def policy_email
        NotificationMailer.policy_email(User.first.email, "1", "2")
    end

    def quotation_email
        NotificationMailer.quotation_email(User.first.email, "3")
    end
end

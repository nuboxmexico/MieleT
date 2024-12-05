class UserMailerPreview < ActionMailer::Preview
    def reset_password_instructions
        DeviseMailer.reset_password_instructions(User.first, "faketoken")
    end

    def welcome_email
        DeviseMailer.welcome_email(User.first)
    end
end

# Remove this conditional if u need to test sentry in development (ONLY IN DEVELOPMENT!!!)
if Rails.env.production?
  Sentry.init do |config|
    config.dsn = Rails.application.secrets.dig(:sentry, :dsn)
    config.environment = Rails.application.secrets.dig(:sentry, :environment)
    config.breadcrumbs_logger = %i[active_support_logger http_logger]
    config.traces_sample_rate = 0.05
    max_trace = Rails.application.secrets.dig(:sentry, :max_trace)

    config.traces_sampler = lambda do |sampling_context|
      # transaction_context is the transaction object in hash form
      # keep in mind that sampling happens right after the transaction is initialized
      # for example, at the beginning of the request
      transaction_context = sampling_context[:transaction_context]

      # transaction_context helps you sample transactions with more sophistication
      # for example, you can provide different sample rates based on the operation or name
      op = transaction_context[:op]
      transaction_name = transaction_context[:name]

      case op
      when /http/
        case transaction_name
        when /home/
          0.0
        when /denied/
          0.0
        when /login/
          0.0
        when /abilities/
          0.0
        when /services/
          0.02
        when /products/
          0.02
        when /visits/
          0.02
        when /customers/
          0.02
        else
          max_trace
        end
      else
        max_trace
      end
    end
  end
end

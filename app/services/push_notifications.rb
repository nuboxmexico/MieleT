class PushNotifications
  # El llamado se hace en cualquier controlador de la siguiente forma:
  # PushNotifications.send_message(token, message, data, badge)
  # Donde:
  #   token: string correspondiente al token obtenido desde la App
  #   message: objeto que contiene un body (string) y un title (string)
  #   data: objeto que contiene 0..n atributos
  def self.send_message(token, message, data, badge)
    scope = 'https://www.googleapis.com/auth/firebase.messaging'

    authorizer = Google::Auth::ServiceAccountCredentials.make_creds(
      json_key_io: File.open('client_secrets.json'),
      scope: scope
    )

    authorizer.fetch_access_token!

    # You can access the token with this method.
    puts("access_token: #{authorizer.access_token}")
    # You can know the expiration time with this method.
    puts("expires_at: #{authorizer.expires_at}")

    url = URI('https://fcm.googleapis.com/v1/projects/miele-app-clientes-b3288/messages:send')
    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true
    http.verify_mode = OpenSSL::SSL::VERIFY_NONE
    request = Net::HTTP::Post.new(url)

    request['Content-Type'] = 'application/json'
    request['Authorization'] = "Bearer #{authorizer.access_token}"

    request.body = {
      message: {
        token: token.to_s,
        notification: message,
        data: data.merge(badge: badge.to_s),
        apns: {
          payload: {
            aps: {
              "content-available": 1
            },
            headers: {
              "apns-priority": '5'
            }
          }
        }
      }
    }.to_json

    puts request.body

    response = http.request(request)

    Rails.logger.debug(response.code)
    Rails.logger.debug(response.body.force_encoding('UTF-8'))
    puts response.body.force_encoding('UTF-8')
  end
end

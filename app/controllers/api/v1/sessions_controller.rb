class Api::V1::SessionsController < Devise::SessionsController
  before_action :sign_in_params, only: :create
  before_action :load_user, only: :create
  before_action :authenticate_user!, only: [:create]
  skip_before_action :verify_authenticity_token, only: :create
  # sign in
  api :POST, '/v1/sign_in', 'Inicia sesión en la plataforma para verificar si existe un registro previo.'
  param :email, String, desc: 'Correo del usuario que busca iniciar sesión'
  param :password, String, desc: 'Contraseña del usuario que busca iniciar sesión'
  param :push_notification_token, String, desc: 'Token para Push notifications en APP'
  example 'Request: ' + Rails.application.config.site_url + "/api/v1/sign_in\n
    Salida:
    {
        messages: 'Ha iniciado sesión satisfactoriamente',
        is_success: true,
        data: {
            user : {
                id: 1,
                firstname: 'Test Name',
                lastname: 'Test Lastname',
                created_at: '18/08/2020 16:10:48',
                updated_at: '16/11/2020 15:36:25',
                email: 'test@email.com',
                surname: 'Test Surname',
                cellphone: '4543123',
                phone: '432123123',
                cost_center: '22',
                role_id: 'test role',
                worktime: 'Full-Time',
                photo: 'url photo',
                api_key: 'test',
                customer_id: 1,
                from_auth: '',
                country: 'MX',
                get_roles_names: 'Test Role Name',
                countries: [{...}],
                fullname: 'Full name',
                roles: [{...}]
          }

        }
    }
	  "
  def create
    if @user.valid_password?(sign_in_params[:password]) && !@user.disabled
      ApiSingleton.update_push_notification_token(@user.customer_id.to_i, sign_in_params[:push_notification_token])
      sign_in 'user', @user
      render json: {
        messages: 'Ha iniciado sesión satisfactoriamente',
        is_success: true,
        data: { user: JSON.parse(@user.to_json(include: [:technician])) }
      }, status: :ok
    else
      render json: {
        messages: (@user.disabled ? "Su cuenta se encuentra deshabilitada" : 'No tiene permisos para realizar esta acción'),
        is_success: false,
        data: {}
      }, status: :unauthorized
    end
  end

  private

  def sign_in_params
    params.permit :email, :password, :push_notification_token
  end

  def load_user
    @user = User.find_for_database_authentication(email: sign_in_params[:email])
    @user || render(json: {
                      messages: 'No se ha encontrado el usuario',
                      is_success: false,
                      data: {}
                    }, status: :not_found)
  end
end

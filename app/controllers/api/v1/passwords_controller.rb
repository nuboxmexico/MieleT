class Api::V1::PasswordsController < Devise::PasswordsController
    before_action :sign_in_params, only: :create
    before_action :authenticate_user!, only: [:create]
    skip_before_action :verify_authenticity_token, :only => :create



    # sign in
    api :POST, "/v1/password", "Recupera la contraseña de un usuario existente"
    param :user, Hash, :desc => "Usuario" do
        param :email, String, :desc => "Correo del usuario que busca recuperar su contraseña"
    end
    param :from, String, :desc => "Plataforma desde la que se intenta recuperar contraseña"
    example "Request: "+Rails.application.config.site_url+"/api/v1/password\n
	Salida:
    {
        messages: 'Se han enviado las instrucciones para reestablecer la contraseña a su correo.',
        is_success: true,
        data: {
            {
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
	"    
    def create
        user = User.find_by(email: params[:user][:email])
        unless user.nil?
            unless params[:from].blank?
                user.update(from_auth: params[:from])
            else
                user.update(from_auth: "")
            end
        end
        self.resource = resource_class.send_reset_password_instructions(resource_params)
        yield resource if block_given?

        if successfully_sent?(resource)
            render json: {
                messages: "Se han enviado las instrucciones para reestablecer la contraseña a su correo.",
                is_success: true,
                data: resource
            }, status: :ok
        else
            #respond_with(resource)
            render json: {
                messages: "No se ha podido enviar la solicitud",
                is_success: false,
                data: resource.errors
              }, status: :unauthorized
        end
    end
    
    private
        def sign_in_params
        params.permit :email, :password
        end

end
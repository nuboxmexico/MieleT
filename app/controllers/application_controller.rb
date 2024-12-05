class ApplicationController < ActionController::Base
	before_action :authenticate_user!, except: [:sign_in]
  before_action :set_locale_from_request
	before_action do
        ActiveStorage::Current.host = Rails.application.config.site_url
    end

	  protect_from_forgery with: :exception

	  rescue_from CanCan::AccessDenied do |exception|
	    respond_to do |format|
	      format.json { head :forbidden, content_type: 'text/html' }
	      format.html { redirect_back fallback_location: root_path, alert: t(:unauhtorized_notice)}
	      format.js   { head :forbidden, content_type: 'text/html' }
	    end
	  end

	  def index
	  end

    def set_locale_from_request

    return ApiSingleton.class_variable_set(:@@current_locale, request.subdomains.first) if request.subdomains.first == 'br'

      ApiSingleton.class_variable_set(:@@current_locale, nil)
    end

	  def after_sign_in_path_for(resource_or_scope)
	    main_app.home_path
	  end

	  def after_sign_out_path_for(resource_or_scope)
	    login_path
	  end

	  def after_resetting_password_path_for(resource)
		Devise.sign_in_after_reset_password ? new_session_path(resource_name) : new_session_path(resource_name)
	  end

	  def current_ability
	    @current_ability ||= Ability.new(current_user, params)
	  end

	  protected

		# Authenticate the user with token based authentication
		def authenticate
			authenticate_token || render_unauthorized
		end

		def authenticate_token
			if current_user.nil?
				authenticate_with_http_token do |token, options|
					@current_user = User.find_by(api_key: token)
				end
			else
				current_user
			end
		end

		def render_unauthorized(realm = "Application")
			self.headers["WWW-Authenticate"] = %(Token realm="#{realm}")
			render json: '{"error": "Ingreso no autorizado"}', status: :unauthorized
		end
end

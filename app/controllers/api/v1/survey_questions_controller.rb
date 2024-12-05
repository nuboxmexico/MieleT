class Api::V1::SurveyQuestionsController < ApplicationController
    protect_from_forgery with: :null_session, only: [:index, :answer]
    skip_before_action :authenticate_user!, only: [:index, :answer]
    include ActionController::HttpAuthentication::Token::ControllerMethods
    before_action :authenticate, only: [:index, :answer]
	
	api :GET, "/v1/survey_questions", "Lista todas las preguntas de encuentas para un servicio de Miele"
    def index

        response = {}
	    response = ApiSingleton.survey_questions_api
	    render json:  response.to_json
	end


	api :POST, "/v1/survey_questions/answer", "Contesta las preguntas de la escuesta para un servicio Miele"
    param :service_id, String, :desc => "Servicio al que pertece la encuesta"
    param :survey_id, String, :desc => "ID de la encuesta"
	param :answers, Array, :desc => "Array de respustas con el formato {id: id_de_pregunta, value: valor_de_pregunta }"
	param :status, String, :desc => "status de la encuesta"
	param :background, String, :desc => "background de la encuesta"
	
	
	def answer
	    survey_answers = ApiSingleton.get_survey_answers_api(params)
		
		render json: survey_answers.to_json
	end

end
class Api::V1::ChecklistsController < ApplicationController
    protect_from_forgery with: :null_session, only: [:index, :customer_product_checklists, :get_answers, :answers]
    skip_before_action :authenticate_user!, only: [:index, :customer_product_checklists, :get_answers, :answers]
    include ActionController::HttpAuthentication::Token::ControllerMethods
    before_action :authenticate, only: [:index, :customer_product_checklists, :get_answers, :answers]
	
	api :GET, "/v1/checklists", "Trae todos checklist de Miele Core"
    example "Request: "+Rails.application.config.site_url+"/api/v1/checklists\n
	Salida:
	{
        data: [
        {
        id: 24,
        question: 'El producto se encuentra en su empaque original y en el sitio para instalacion',
        created_at: '2021-02-16T19:33:54.740Z',
        updated_at: '2021-02-16T19:33:54.740Z'
        },
        {
        id: 25,
        question: 'El producto ordenado es correcto para el tipo de gas en sitio',
        created_at: '2021-02-16T19:33:54.758Z',
        updated_at: '2021-02-16T19:33:54.758Z'
        },
        {
        id: 26,
        question: 'Linea electrica dedicada con fusible (break) separado',
        created_at: '2021-02-16T19:33:54.773Z',
        updated_at: '2021-02-16T19:33:54.773Z'
        },
        {
        id: 27,
        question: 'Hay una valvula de cierre de gas accesible, al lado o detrás del equipo',
        created_at: '2021-02-16T19:33:54.784Z',
        updated_at: '2021-02-16T19:33:54.784Z'
        },
        {
        id: 28,
        question: 'Hay un kit de conexión de gas, flexible, en el sitio de instalacion',
        created_at: '2021-02-16T19:33:54.794Z',
        updated_at: '2021-02-16T19:33:54.794Z'
        },
        {
        id: 29,
        question: 'Dimensiones del nicho (Son correctas para el producto) ',
        created_at: '2021-02-16T19:33:54.807Z',
        updated_at: '2021-02-16T19:33:54.807Z'
        }
        ]
    }
    "
    def index
	    response = {}
	    consumables = ApiSingleton.checklists_api(params)
	    render json:  consumables.to_json
    end
    

    api :GET, "/v1/customer_product_checklists", "Trae todos checklists asociados producto de un cliente"
    param :customer_product_id, String, :desc => "ID del producto del cliente"
    example "Request: "+Rails.application.config.site_url+"/api/v1/customer_product_checklists?customer_product_id=1\n
	Salida:
	{
        data: [
        {
        id: 24,
        question: 'El producto se encuentra en su empaque original y en el sitio para instalacion',
        created_at: '2021-02-16T19:33:54.740Z',
        updated_at: '2021-02-16T19:33:54.740Z'
        },
        {
        id: 25,
        question: 'El producto ordenado es correcto para el tipo de gas en sitio',
        created_at: '2021-02-16T19:33:54.758Z',
        updated_at: '2021-02-16T19:33:54.758Z'
        },
        {
        id: 26,
        question: 'Linea electrica dedicada con fusible (break) separado',
        created_at: '2021-02-16T19:33:54.773Z',
        updated_at: '2021-02-16T19:33:54.773Z'
        },
        {
        id: 27,
        question: 'Hay una valvula de cierre de gas accesible, al lado o detrás del equipo',
        created_at: '2021-02-16T19:33:54.784Z',
        updated_at: '2021-02-16T19:33:54.784Z'
        },
        {
        id: 28,
        question: 'Hay un kit de conexión de gas, flexible, en el sitio de instalacion',
        created_at: '2021-02-16T19:33:54.794Z',
        updated_at: '2021-02-16T19:33:54.794Z'
        },
        {
        id: 29,
        question: 'Dimensiones del nicho (Son correctas para el producto) ',
        created_at: '2021-02-16T19:33:54.807Z',
        updated_at: '2021-02-16T19:33:54.807Z'
        }
        ]
    }
	"
    def customer_product_checklists
        response = {}
	    consumables = ApiSingleton.customer_product_checklists_api(params)
	    render json:  consumables.to_json
    end
    
    api :GET, "/v1/customer_product_checklists/:customer_product_id/get_answers", "Trae todas las respuestas de checklists asociados producto de un cliente"
    param :customer_product_id, String, :desc => "ID del producto del cliente"
    example "Request: "+Rails.application.config.site_url+"/api/v1/customer_product_checklists/1/get_answers\n
	Salida:
	{
        data: [
        {
        id: 24,
        question: 'El producto se encuentra en su empaque original y en el sitio para instalacion',
        created_at: '2021-02-16T19:33:54.740Z',
        updated_at: '2021-02-16T19:33:54.740Z'
        },
        {
        id: 25,
        question: 'El producto ordenado es correcto para el tipo de gas en sitio',
        created_at: '2021-02-16T19:33:54.758Z',
        updated_at: '2021-02-16T19:33:54.758Z'
        },
        {
        id: 26,
        question: 'Linea electrica dedicada con fusible (break) separado',
        created_at: '2021-02-16T19:33:54.773Z',
        updated_at: '2021-02-16T19:33:54.773Z'
        },
        {
        id: 27,
        question: 'Hay una valvula de cierre de gas accesible, al lado o detrás del equipo',
        created_at: '2021-02-16T19:33:54.784Z',
        updated_at: '2021-02-16T19:33:54.784Z'
        },
        {
        id: 28,
        question: 'Hay un kit de conexión de gas, flexible, en el sitio de instalacion',
        created_at: '2021-02-16T19:33:54.794Z',
        updated_at: '2021-02-16T19:33:54.794Z'
        },
        {
        id: 29,
        question: 'Dimensiones del nicho (Son correctas para el producto) ',
        created_at: '2021-02-16T19:33:54.807Z',
        updated_at: '2021-02-16T19:33:54.807Z'
        }
        ]
    }
	"
    def get_answers
        response = {}
	    checklists = ApiSingleton.customer_product_get_checklists_answers_api(customer_product_checklist_params)
	    render json:  checklists.to_json
    end


    api :POST, "/v1/customer_product_checklists/:customer_product_id/answers", "Responde todos checklists asociados producto de un cliente"
    param :customer_product_id, String, :desc => "ID del producto del cliente"
    param :preVisit, [true, false, "true", "false"], :desc => "true o false para indicar si se realiza previsita"
    param :status, String, :desc => "Estaus del producto del cliente"
    param :answers, Array, desc: "Respuestas del checklist" do
        param :checklist_id, String, desc: "ID de la pregunta del checklist contestada"
        param :background, String, desc: "Antencedentes entregados a la pregunta"
        param :answer, String, desc: "Respuesta a la pregunta (Si/No)"
    end
    param :images, Array, :desc => "Array de imagenes a asociar images:[{uri: [path de la imagen], mime: [formato], uri_64: [imagen en base 64], filename: [nombre imagen}, description: {descripción de la imagen}]"
	
    example "Request: "+Rails.application.config.site_url+"/api/v1/customer_product_checklists/1/answers\n
	Salida:
	{
        data: [
        {
        id: 24,
        question: 'El producto se encuentra en su empaque original y en el sitio para instalacion',
        created_at: '2021-02-16T19:33:54.740Z',
        updated_at: '2021-02-16T19:33:54.740Z'
        },
        {
        id: 25,
        question: 'El producto ordenado es correcto para el tipo de gas en sitio',
        created_at: '2021-02-16T19:33:54.758Z',
        updated_at: '2021-02-16T19:33:54.758Z'
        },
        {
        id: 26,
        question: 'Linea electrica dedicada con fusible (break) separado',
        created_at: '2021-02-16T19:33:54.773Z',
        updated_at: '2021-02-16T19:33:54.773Z'
        },
        {
        id: 27,
        question: 'Hay una valvula de cierre de gas accesible, al lado o detrás del equipo',
        created_at: '2021-02-16T19:33:54.784Z',
        updated_at: '2021-02-16T19:33:54.784Z'
        },
        {
        id: 28,
        question: 'Hay un kit de conexión de gas, flexible, en el sitio de instalacion',
        created_at: '2021-02-16T19:33:54.794Z',
        updated_at: '2021-02-16T19:33:54.794Z'
        },
        {
        id: 29,
        question: 'Dimensiones del nicho (Son correctas para el producto) ',
        created_at: '2021-02-16T19:33:54.807Z',
        updated_at: '2021-02-16T19:33:54.807Z'
        }
        ]
    }
	"
    def answers
        response = {}
	    checklists = ApiSingleton.customer_product_checklists_answers_api(customer_product_checklist_params, params)
	    render json:  checklists.to_json
    end



    private 
        def customer_product_checklist_params
            params.permit(:customer_product_id, :preVisit, :status, images: [], answers: [:checklist_id, :background, :answer])
        end
end
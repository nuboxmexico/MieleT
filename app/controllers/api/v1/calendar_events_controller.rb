class Api::V1::CalendarEventsController < ApplicationController
    protect_from_forgery with: :null_session, only: [:index, :create, :index_technician_calendar_events, :destroy]
    skip_before_action :authenticate_user!, only: [:index, :create, :index_technician_calendar_events, :destroy]
    include ActionController::HttpAuthentication::Token::ControllerMethods
    before_action :authenticate, only: [:index, :create, :index_technician_calendar_events, :destroy]
	
	api :GET, "/v1/calendar_events", "Trae todos los eventos bloqueados"
    param :country, String, :desc => "PAIS del calendario"
    param :all, String, :desc => "1 para traer todos los eventos, 0 solo para traer solo los bloqueados por feriado o festivos"
    example "Request: "+Rails.application.config.site_url+"/api/v1/calendar_events?country=CL\n
	Salida:
	{
        data: [
            {
            allDay: false,
            groupId: 'Bloqueados',
            start: '2020-10-12T11:00:00+00:00',
            end: '2020-10-13T19:30:00+00:00',
            overlap: false,
            display: 'background'
            },
            {
            allDay: true,
            start: '2020-10-22',
            end: '2020-10-25',
            overlap: false,
            display: 'background'
            },
            {
            allDay: true,
            start: '2020-10-27',
            end: '2020-10-30',
            overlap: false,
            display: 'background'
            }
        ]
    }
	"
    def index
        response = {}
        calendar_events = ApiSingleton.calendar_events_api(params[:country], params[:all])
	    render json:  calendar_events.to_json
    end

    def colors
      render json: ApiSingleton.colors.to_json
    end
    
    api :GET, "/v1/technician_calendar_events", "Trae todos los eventos bloqueados de un técnico"
    param :technician_id, String, :desc => "ID del tecnico a consultar sus eventos [1,2,3]"
    param :calendar_start_date, String, :desc => "Fecha de inicio del calendario"
    param :calendar_finish_date, String, :desc => "Fecha de fin del calendario"
    example "Request: "+Rails.application.config.site_url+"/api/v1/technician_calendar_events?technician_id=11\n
	Salida:
	{
        data: [
            {
                allDay: false,
                groupId: 'Blocked_Technician',
                title: 'Bloqueado',
                description: 'Tecnico: TEST DEFINITIVO DE CREACIÓN ',
                start: '2020-10-15T22:00:00+00:00',
                end: '2020-10-15T23:00:00+00:00',
                overlap: false,
                display: 'background'
            },
            {
                allDay: true,
                groupId: 'Blocked_Technician',
                title: 'Bloqueado',
                description: 'Tecnico: TEST DEFINITIVO DE CREACIÓN ',
                start: '2020-10-09',
                end: '2020-10-10',
                overlap: false,
                display: 'background'
            }
        ]
    }
	"
    def index_technician_calendar_events
      calendar_events = ApiSingleton.technician_calendar_events_api(params[:technician_id],params[:calendar_start_date],params[:calendar_finish_date])
      render json: calendar_events.to_json
    end

    api :POST, "/v1/calendar_events", "Crea nuevos dias bloqueados en el calendario global"
    def create
        
    end
    
    api :DELETE, "/v1/calendar_events/destroy_event", "Elimina dias bloqueados en el calendario global"
    param :start_date, String, :desc => "Fecha de inicio del envento en el calendario"
    param :finish_date, String, :desc => "Fecha de término del envento en el calendario"
    param :technician_id, String, :desc => "ID del técnico del envento en el calendario"
    def destroy
        response = {}
        calendar_events = ApiSingleton.destroy_technician_calendar_events(params[:start_date], params[:finish_date], params[:technician_id])
        render json: ["Hecho", "Se ha eliminado el evento."], status: :ok
    end

    private
        def calendar_event_params
            params.permit(:title, :start_date, :finish_date, :allDay, :event_type, :description)
        end

end

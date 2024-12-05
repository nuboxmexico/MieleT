class Api::V1::TaxonsController < ApplicationController
    protect_from_forgery with: :null_session
    skip_before_action :authenticate_user!
    include ActionController::HttpAuthentication::Token::ControllerMethods
    before_action :authenticate
    
    api :GET, "/v1/taxons", "Retorna las habilidades seleccionables para los técnicos"
    param :keywords, String, :desc => "Filtro de texto para encontrar al cliente"
    example "Request: "+Rails.application.config.site_url+"/api/v1/taxons\n
    Salida:
    [
        {
            value: 5367,
            label: 'Servicios'
        },
        {
            value: 5462,
            label: 'Accesorio',
            children: [
                {
                    value: 5463,
                    label: 'Accesorios',
                    children: [
                        {
                            value: 5464,
                            label: 'Accesorios de instalación',
                            children: [
                                {
                                value: 5465,
                                label: 'Decorativo customizado'
                                }
                            ]
                        },
                        {
                            value: 5469,
                            label: 'Accesorios para hornos',
                            children: [
                                {
                                value: 5470,
                                label: 'Hornos a vapor'
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {...},
    ]
	"
    def index
        keywords = (params[:keywords].blank? ? "tickets" : params[:keywords])
        country = (params[:country].blank? ? "MX" : params[:country])
        response = ApiSingleton.taxons_api(keywords, country)
        if response['data'].length.zero?
          new_response = response
        else
          new_response = response["data"].first["taxons_first_level"].map{ |taxon|  
              { 
                  value: taxon["id"], 
                  label: taxon["name"] 
              }.merge( taxon["children_set"].size > 0 ? 
                  { 
                      children: taxon["children_set"].map{ |child_taxon_1|
                      { 
                          value: child_taxon_1["id"], 
                          label: child_taxon_1["name"], 
                      }.merge( child_taxon_1["children_set"].size > 0 ? 
                          {
                          children: child_taxon_1["children_set"].map{ |child_taxon_2|
                              { 
                                  value: child_taxon_2["id"], 
                                  label: child_taxon_2["name"] 
                              }.merge( child_taxon_2["children_set"].size > 0 ?
                                  {
                                      children: child_taxon_2["children_set"].map{ |child_taxon_3|
                                          { 
                                              value: child_taxon_3["id"], 
                                              label: child_taxon_3["name"]
                                          }
                                      }
                              } : {})
                          }
                      } : {})
                  }
              } : {})
          }
        end

        render json: new_response
	end

    api :GET, "/v1/taxon_names", "Lista todos los centro de costos de Miele"
    param :taxon_ids, String, :desc => "Ids de taxons separados por comas (opcionales)"
    example "Request: "+Rails.application.config.site_url+"/api/v1/taxons\n
    Salida:
    [
        {
            id: 5367,
            name: 'Servicios'
        }
        {...},
    ]
	"
	def index_names
	    response = {}
	    taxon_ids = (params[:taxon_ids].blank? ? nil : params[:taxon_ids])
        response = ApiSingleton.taxon_names_api(taxon_ids)
	    render json:  response
	end
end

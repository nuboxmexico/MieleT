class Api::V1::ConsumablesController < ApplicationController
    protect_from_forgery with: :null_session, only: [:index]
    skip_before_action :authenticate_user!, only: [:index]
    include ActionController::HttpAuthentication::Token::ControllerMethods
    before_action :authenticate, only: [:index]
	
	api :GET, "/v1/consumables", "Lista consumibles para un grupode productos"
	example "Request: "+Rails.application.config.site_url+"/api/v1/consumables\n
	Salida:
	{
		data: [
			{
				id: 2,
				name: 'paño',
				units_per_event: 3,
				product_id: 17,
				events: 2,
				units_per_box: 3,
				created_at: '2020-11-24T19:54:18.431Z',
				updated_at: '2020-11-24T19:54:18.431Z',
				taxons: [
					{
						id: 5475,
						name: 'Encimeras',
						permalink: 'encimeras',
						taxonomy_id: 2,
						created_at: '2020-11-24T18:54:03.755Z',
						updated_at: '2020-11-24T18:54:03.755Z',
						ancestry: null,
						alias: null,
						children_set: [
							{
								id: 5476,
								name: 'A gas',
								permalink: 'encimeras/a_gas',
								taxonomy_id: 2,
								created_at: '2020-11-24T18:54:03.818Z',
								updated_at: '2020-11-24T18:54:03.818Z',
								ancestry: '5475',
								alias: null,
								children_set: [
									{
										id: 5477,
										name: 'vapor',
										permalink: 'encimeras/a_gas/vapor',
										taxonomy_id: 2,
										created_at: '2020-11-24T18:54:03.854Z',
										updated_at: '2020-11-24T18:54:03.854Z',
										ancestry: '5476',
										alias: null,
										children_set: [ ]
									}
								]
							}
						]
					}
				]
			},
			{...}
		]
	}
	"
    def index
	    response = {}
	    consumables = ApiSingleton.consumables_api(params)
	    render json:  consumables.to_json
	end
end
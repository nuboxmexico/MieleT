module Api
  module V1
    class CountriesController < ApplicationController
      skip_before_action :authenticate_user!
      before_action :authenticate

      def index
        render json: ApiSingleton.all_countries
      end
    end
  end
end

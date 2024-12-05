module Api
  module V1
    class ProjectsController < ApplicationController
      def show
        response = ApiSingleton.project_show(params[:id]) || {}
        render json: response
      end
    end
  end
end

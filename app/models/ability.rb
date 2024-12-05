class Ability
  include CanCan::Ability

  def initialize(user, _params = nil)
    if user.present?  # additional permissions for logged in users (they can manage their posts)
      if user.admin?  # additional permissions for administrators
        can :index, Home
        can :manage, Customer
        can :manage, Calendar
        can :manage, Survey
        can :manage, :all
      elsif user.finance?
        can :index, Home
        can :manage, Customer
        can :manage, Calendar
        can :manage, Survey
        can :manage, :all
      elsif user.contact_center?
        can :index, Notification
        can :index, DataDownload
        can :manage, Technician
        can :manage, Calendar
        can :index, Service
        can :show, Service
        can :manage, Survey
        can :manage, Customer
      elsif user.field_service? || user.tech_managment? || user.technician? || user.delivery?
        can :index, Notification
        can :index, DataDownload
        can :manage, Technician
        can :manage, Calendar
        can :index, Service
        can :show, Service
        can :manage, Customer
      elsif user.customer?
        cannot :index, Notification
        
      end
      can :index, Home
      can :projectCustomers, Customer
      # can :index, Notification
      # cannot :denied, Home
      # can :manage, Customer
    end
  end
end

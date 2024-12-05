class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable :registerable
  validates :email, presence: true
  has_many :user_roles, dependent: :destroy
  has_many :roles, through: :user_roles

  has_many :user_countries, dependent: :destroy
  has_many :countries, through: :user_countries
  has_one :technician

  has_many :notifications, as: :recipient

  after_find :get_role_data
  attribute :country
  attribute :get_roles_names
  attribute :get_roles_list
  attribute :countries
  attribute :fullname
  attribute :technician_id
  attribute :notifcations_number
  devise :database_authenticatable,
         :recoverable, :rememberable, :validatable
    #after_create :send_welcome_email

    validates :lastname, presence: true
    validates :surname, presence: true
    #validates :phone, presence: true
    #validates :role_id, presence: true

  validate :check_if_customer_exists, on: :create

  
  def ability
    @ability ||= Ability.new(self)
  end
  
  delegate :can?, :cannot?, :to => :ability

  def notifcations_number
    self.notifications.unread.size
  end

  def technician_id
    self.technician.try(:id)
  end

  def check_if_customer_exists
    @customer = ApiSingleton.customers_api("1", "10", email)
    if @customer["data"].any? && @customer["data"][0]["email"] == email
      if customer_id.to_s != @customer["data"][0]["id"].to_s
        errors.add(:email, "ya en uso por cliente.")
      end
    end
  end

  def country
    return self.countries[0].try(:iso) rescue nil
  end

    def generate_api_key
      token = ""
      loop do
        token = SecureRandom.base64.tr('+/=', 'Qrt')
        break token unless User.exists?(api_key: token)
      end
      self.update(api_key: token)
    end

    def created_at
      self[:created_at].strftime("%d/%m/%Y %H:%M:%S") unless self[:created_at].nil?
    end

    def updated_at
      self[:updated_at].strftime("%d/%m/%Y %H:%M:%S") unless self[:updated_at].nil?
    end
    
    def admin?
	    return self.roles.include?(Role.find_or_create_by(name: "Administrador"))
    end

    def finance?
	    return self.roles.include?(Role.find_or_create_by(name: "Finanzas"))
    end
    
    def field_service?
	    return self.roles.include?(Role.find_or_create_by(name: "Field Service"))
    end
    
    def tech_managment?
	    return self.roles.include?(Role.find_or_create_by(name: "Technical Management"))
    end
    
    def contact_center?
	    return self.roles.include?(Role.find_or_create_by(name: "Contact Center"))
  	end

    def technician?
	    return self.roles.include?(Role.find_or_create_by(name: "Técnico"))
  	end

    def customer?
	    return self.roles.include?(Role.find_or_create_by(name: "Cliente"))
  	end


    def delivery?
	    return self.roles.include?(Role.find_or_create_by(name: "Entregas/Despacho"))
  	end

    

    def role
      return "admin"
    end

    def self.default_pass
      "mielePartner"
    end
  

    def fullname_raw_json
      self.try(:firstname).to_s + ' ' + self.try(:lastname).to_s 
    end

  	def self.search(text)
      User.distinct(:id).includes(:roles).joins(:countries).where("
        lower(users.firstname) ilike ? OR
        lower(users.lastname) ilike ? OR
        lower(users.email) ilike ? OR
        lower(users.phone) ilike ? OR
        unaccent(lower(countries.name)) ilike ?", "%#{text.try(:downcase)}%","%#{text.try(:downcase)}%", "%#{text.try(:downcase)}%", "%#{text.try(:downcase)}%", "%#{text.try(:downcase)}%")
    end

    def get_roles_names_raw_json
      return self.roles.first.try(:name)
    end

    def get_role_data
      # define instance variable to validate new data
      @get_roles_names = self.get_roles_names_raw_json
      @get_roles_list = self.roles.pluck(:name) rescue ""
      @fullname = self.fullname_raw_json
      self.get_roles_names = (@get_roles_names)
      self.get_roles_list = (@get_roles_list)
      self.fullname = @fullname
    end

    # def send_welcome_email
    #   # puts self.inspect
    #   # puts "####################"
    #   # puts self.roles.inspect
    #   # DeviseMailer.welcome_email(self).deliver_now if !self.customer?
    # end
    
    private
    
      
end

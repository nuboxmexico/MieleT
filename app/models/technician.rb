class Technician < ApplicationRecord
  belongs_to :user
  has_many :technician_activities, dependent: :destroy
  has_many :activities, through: :technician_activities
  has_many :technician_zipcodes, dependent: :destroy
  has_many :zipcodes, through: :technician_zipcodes
  
  has_many :technician_taxons, dependent: :destroy
  #attribute :technician_taxons_grouped
  #attribute :technician_taxons
  attribute :user
  attribute :activities
  has_one_attached :avatar

  def technician_taxons_grouped
    technician_taxons.group_by(&:taxon_type)
  end

  def self.search_by_taxon_id(taxon_ids, taxon_type = "", country, zone)
    ids = taxon_ids.split(",")
    query = 'technician_taxons.taxon_id IN (?) AND technician_taxons.taxon_type = ?'
    current_technicians = Technician.joins(:technician_taxons).where(query, ids, Technician.taxonTypeName(taxon_type)).distinct
    unless zone.nil?
      if country == "MX"
        current_technicians = current_technicians.joins(:zipcodes).where("zipcodes.zip = ?",zone)
      else
        current_technicians = current_technicians.joins(:zipcodes).where("zipcodes.administrative_demarcation_name = ?", zone)
      end
    end
    others_technicians = Technician.where.not(id: (current_technicians.pluck(:id)))
    unless country.blank?
			current_technicians = current_technicians.joins(user: :countries).where("countries.iso = ?", country)
      others_technicians = others_technicians.joins(user: :countries).where("countries.iso = ?", country)
    end
    return current_technicians, others_technicians
  end


  def self.search_by_taxons_names(taxons_names, taxon_type = "", country, zone)
    ids = taxons_names.split(",")
    query = 'technician_taxons.taxon_name IN (?) AND technician_taxons.taxon_type = ?'
    current_technicians = Technician.joins(:technician_taxons).where(query, ids, Technician.taxonTypeName(taxon_type)).distinct
    unless zone.nil?
      if country == "MX"
        current_technicians = current_technicians.joins(:zipcodes).where("zipcodes.zip = ?",zone)
      else
        current_technicians = current_technicians.joins(:zipcodes).where("zipcodes.administrative_demarcation_name = ?", zone)
      end
    end
    others_technicians = Technician.where.not(id: (current_technicians.pluck(:id)))
    unless country.blank?
			current_technicians = current_technicians.joins(user: :countries).where("countries.iso = ?", country)
      others_technicians = others_technicians.joins(user: :countries).where("countries.iso = ?", country)
    end
    return current_technicians, others_technicians
  end
  

  def created_at
    self[:created_at].strftime("%d/%m/%Y %H:%M:%S") unless self[:created_at].nil?
  end

  def updated_at
    self[:updated_at].strftime("%d/%m/%Y %H:%M:%S") unless self[:updated_at].nil?
  end
  def self.search(text)
    Technician.joins(:user).where("lower(users.firstname) ilike ? OR lower(users.lastname) ilike ? OR lower(users.email) ilike ?", "%#{text.try(:downcase)}%","%#{text.try(:downcase)}%", "%#{text.try(:downcase)}%")
  end

  def self.taxonTypeName(name)
    if name == 'Instalación'
      return "installation"
    elsif name == 'Mantenimiento'
        return "maintenance"
    elsif name == 'Reparación'
        return "repair"
    elsif name == 'Diagnóstico en Taller'
        return "diagnosis"
    elsif name == 'Home Program'
        return "home_program"
    elsif name == 'Entregas/Despachos'
        return "delivery"
    end
    
  end


  def create_zipcodes(zipcodes, country_iso)

    i = 0
    errors = []
    zone_value =  (country_iso == "CL" ? "Comunas" : "Código Postal")
    headers = (country_iso == "CL" ? {administrative_demarcation_name: zone_value, delete: "Borrar" } : {zip: zone_value, delete: "Borrar"  })
    zipcodes.each(headers) do |row|
        if i > 0
          begin
            country = Country.where(iso: country_iso).try(:take)

            unless country.nil?
              zipcode = (country_iso != "CL" ? Zipcode.where(zip: row[:zip]).try(:take) : Zipcode.where(administrative_demarcation_name: row[:administrative_demarcation_name]).try(:take) )
              unless zipcode.nil?
                zipcode.update!(
                  {
                    administrative_demarcation_name: row[:administrative_demarcation_name], 
                    zip: row[:zip]
                  }
                )
              else
                zipcode = Zipcode.create!(
                  {
                    administrative_demarcation_name: row[:administrative_demarcation_name], 
                    zip: row[:zip]
                  }
                )
              end

              tech_zipcode = self.technician_zipcodes.where(zipcode_id: zipcode.id).try(:take)
              if row[:delete].try(:downcase) == "si" && !tech_zipcode.nil?
                tech_zipcode.destroy
              elsif tech_zipcode.nil?
                self.zipcodes << zipcode
              end
            end

          rescue Exception => e
              errors << "Fila: #{(i+1)}. El zipcode (#{row[:zone].to_s.strip} - #{country_iso}) #{e.message}"
          end
        end
        i = i + 1
    end		  		
    return errors
  end
end

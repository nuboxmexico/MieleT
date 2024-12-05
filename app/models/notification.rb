class Notification < ApplicationRecord
  include Noticed::Model
  belongs_to :recipient, polymorphic: true

  alias_method "read", "read?"
  alias_method "unread", "unread?"

  def created_at
    self[:created_at].strftime("%d/%m/%Y %H:%M:%S")
  end

  def days
    DateTime.now.mjd - Date.parse(self.created_at).mjd
  end

  class ActiveRecord::Relation 
    def search(text)
      self.where("unaccent(lower(cast(params -> 'data' -> 'name' AS TEXT))) LIKE ? OR unaccent(lower(cast(params -> 'data' -> 'description' AS TEXT))) LIKE ?",  "%#{ActiveSupport::Inflector.transliterate(text.downcase)}%",  "%#{ActiveSupport::Inflector.transliterate(text.downcase)}%")
    end
  end
end

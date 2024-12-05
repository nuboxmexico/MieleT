class Payment < ApplicationRecord
  belongs_to :user, optional: true
  belongs_to :payment_method
  after_save :check_if_paid
  after_update :check_if_paid
  after_initialize :set_transaction_id
  attribute :payment_method_name
  def webpay?
    self.payment_method.try(:type) == Gateway::WebpayGateway.to_s
  end

  def payment_method_name
    self.try(:payment_method).try(:name)
  end

  def generate_transaction_id
    Digest::MD5.hexdigest("#{self.try(:customer_id)}#{self.try(:object_id)}")
  end

  def perform_payment
    self.update(status: "completed")
    today = DateTime.now

    if self.object_class == "Servicio"
      service_params = {id: self.object_id}
      service = ApiSingleton.service_api(service_params)
      visit_id = service["last_visit"]["id"].to_s
    else
      visit_id = self.object_id.to_s
    end

    update_visits_params = {
      id: visit_id,
      payment_date: today, 
      customer_payment_date: today
    }

    ApiSingleton.get_update_visit_api(update_visits_params)

  end

  private

    def check_if_paid
      if self.status == 'completed' && self.object_class == "Servicio"
        update_service_params = {
          service_id: self.try(:object_id),
          customer_id: self.try(:customer_id),
          payment_state: 'paid'
        }
        ApiSingleton.get_update_customer_service_api(update_service_params)
      end
    end

    def set_transaction_id
      self.transaction_id ||= self.generate_transaction_id
    end

end

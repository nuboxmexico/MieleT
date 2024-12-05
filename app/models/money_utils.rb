class MoneyUtils
    def self.get_money_country_format(amount, country)
    amount_format = ""
    country_type = country.blank? ?  "MX": country
    case country_type
    when 'CL'
      amount_format = "$ #{ActionController::Base.helpers.number_to_currency(amount.try(:round, 0), unit: "", separator: ",", delimiter: ".", precision: 0)}"
    when 'MX'
      amount_format = "$ #{ActionController::Base.helpers.number_to_currency(amount, unit: "", separator: ".", delimiter: ",", precision: 2)}"
    when 'BR'
      amount_format = "R$ #{ActionController::Base.helpers.number_to_currency(amount, unit: "", separator: ".", delimiter: ",", precision: 2)}"
    end 
    amount_format
  end

  def self.product_price(product, country, quantity = 1)
    price = nil
    if product["product_prices"].size > 0
      price = product["product_prices"].select{ |price| (price["country"]["iso"] == country)}
    end
    
    if !price.blank?
      unless price[0]["sale_price"].nil?
        return MoneyUtils.get_money_country_format((price[0]["sale_price"] != nil ? price[0]["sale_price"] : price[0]["price"]) * quantity, country)
      else
        return MoneyUtils.get_money_country_format(0, country)
      end
    else
      return MoneyUtils.get_money_country_format(0, country)
    end
  end

  def self.quotation_spare_part_price(quotation_spare_part, country, quantity = 1)
    product = quotation_spare_part["spare_part"]
    if quotation_spare_part["price"] != nil
      return MoneyUtils.get_money_country_format(quotation_spare_part["price"] * quantity, country)
    else
      return MoneyUtils.product_price(product, country, quantity)
    end
  end
end
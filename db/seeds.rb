# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)


Role.find_or_create_by(name: "Administrador")
Role.find_or_create_by(name: "Contact Center")
Role.find_or_create_by(name: "Technical Management")
Role.find_or_create_by(name: "Field Service")
Role.find_or_create_by(name: "Técnico")
Role.find_or_create_by(name: "Cliente")
Role.find_or_create_by(name: "Entregas/Despacho")
Role.find_or_create_by(name: "Home Program")
Role.find_or_create_by(name: "Finanzas")


Activity.find_or_create_by(name: "Instalación")
Activity.find_or_create_by(name: "Mantenimiento")
Activity.find_or_create_by(name: "Reparación")
Activity.find_or_create_by(name: "Diagnóstico en Taller")
Activity.find_or_create_by(name: "Home Program")
Activity.find_or_create_by(name: "Entregas/Despachos")

mx = Country.find_or_create_by(name: "México", iso: "MX")
cl = Country.find_or_create_by(name: "Chile", iso: "CL")
br = Country.find_or_create_by(name: "Brasil", iso: "BR")

PaymentMethod.find_or_create_by(name: "WebPay", provider: "webpay", logo: "webpay", country_id: cl.id)
PaymentMethod.find_or_create_by(name: "American Express", provider: "american express", logo: "amex", country_id: mx.id)
PaymentMethod.find_or_create_by(name: "EVO Payments", provider: "visa|mastercard", logo: "evopayments", country_id: mx.id)
PaymentMethod.find_or_create_by(name: "Juno", provider: "juno", logo: "juno", country_id: br.id)
PaymentMethod.find_or_create_by(name: "Cielo", provider: "cielo", logo: "cielo", country_id: br.id)





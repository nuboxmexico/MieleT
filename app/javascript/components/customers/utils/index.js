function buildFullName(customer) {
  return `${customer.names} ${customer.lastname || ''}`
}

function buildCustomerShowLink(customer) {
  return `/customers/${customer.id}/show`
}

function isB2bEan(serial_id, b2b_ean) {
  if (!serial_id) return false
  if (!b2b_ean) return false

  return serial_id === b2b_ean
}

export {
  buildFullName,
  buildCustomerShowLink,
  isB2bEan,
}

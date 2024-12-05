import axios from 'axios'

export async function fetchPaymentVisit(visit_id, service_id) {
  const params = {
    object_id: visit_id,
    object_class: 'Visita',
    service_id: service_id,
  }

  const { data: { data } } = await axios.get('/api/v1/payments', { params })
  return data[0] || {}
}

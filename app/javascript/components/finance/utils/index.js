const NO_PAYMENT = 'No requiere pago'
const PAID = 'Si'
const UNPAID = 'No'

export function pendingInvoicing(finishTime) {
  if (!finishTime) {
    return '-'
  }

  const finishDate = new Date(finishTime).getTime()
  const currentDate = new Date().getTime()
  const differenceDate = finishDate - currentDate
  const days = parseInt((differenceDate / (1000 * 3600 * 24))) * 1
  return `${Math.abs(days)} días`
}

export function visitAreCompleted(visit) {
  return visit.status_label === 'Visita completada' || visit.status === 'Visita completada'
}

export function visitPaidStatus(visit) {
  if (visit.no_payment) {
    return 'unrequired'
  }

  if (visit.validated_payment || visit.payment_state == 'paid') {
    return 'paid'
  }

  return 'unpaid'
}

export function visitPaidStatusLabel(visit) {
  const status = {
    unrequired: NO_PAYMENT,
    paid: PAID,
    unpaid: UNPAID
  }

  return status[visitPaidStatus(visit)]
}

export function toQueryParams(data) {
  const result = {}
  Object.keys(data).forEach((item) => {
    if (typeof(data[item]) == 'string') {
      result[item] = data[item]
    } else {
      result[item] = data[item].join(',')
    }
  })
  return result
}

export function modifyFilter(payload) {
  return dispatch => {
    dispatch({
      type: '@FINANCE/SELECTED_OPTIONS',
      payload
    })
  }

}

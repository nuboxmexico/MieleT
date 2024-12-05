import i18next from 'i18next';

export function invoiceStatus(invoiced) {
  const status = {
    pending: i18next.t('finance.input.pending'),
    completed: i18next.t('finance.input.completed'),
    unrequired: i18next.t('finance.input.unrequired'),
  }
  return status[invoiced]
}

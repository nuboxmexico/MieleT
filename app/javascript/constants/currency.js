export const CURRENCY_SYMBOLS = {
  BR: 'R$',
  CL: '$',
  MX: '$',
}

export const DECIMAL_PLACES = {
  BR: 2,
  MX: 2,
  CL: 0
}

export const LANGUAGE = {
  BR: 'pt-BR',
  MX: 'es-MX',
  CL: 'es-CL',
}


export const currencyFormatter = (country_code) => {
  return new Intl.NumberFormat(
    LANGUAGE[country_code],
    { minimumFractionDigits: DECIMAL_PLACES[country_code], maximumFractionDigits: DECIMAL_PLACES[country_code] }
  )
}

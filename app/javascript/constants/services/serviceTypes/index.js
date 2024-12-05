import serviceTypesES from './es'
import serviceTypesPT from './pt'

const serviceTypesPerLng = {
  es: serviceTypesES,
  pt: serviceTypesPT
}

export default function(lng) {
  return serviceTypesPerLng[lng]
}

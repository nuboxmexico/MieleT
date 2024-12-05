import serviceTypeES from './es'
import serviceTypePT from './pt'

const serviceTypePerLng = {
  es: serviceTypeES,
  pt: serviceTypePT
}

export default function(lng) {
  return serviceTypePerLng[lng]
}

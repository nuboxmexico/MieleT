import requestedES from './es'
import requestedPT from './pt'

const requestedPerLng = {
  es: requestedES,
  pt: requestedPT
}

export default function (lng) {
  return requestedPerLng[lng]
}

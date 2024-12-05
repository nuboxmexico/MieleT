import channelsES from './es'
import channelsPT from './pt'

const channelsPerLng = {
  es: channelsES,
  pt: channelsPT
}

export default function (lng) {
  return channelsPerLng[lng]
}

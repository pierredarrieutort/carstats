import LogMobile from '../utils/LogMobile'
import GPSHandler from './map/GPSHandler'

export default function initMap () {
  new LogMobile()

  const gpsHandler = new GPSHandler()
  gpsHandler.getLocation()
}

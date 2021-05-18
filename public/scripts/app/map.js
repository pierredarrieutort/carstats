import GPSHandler from './map/GPSHandler'

export default function initMap () {
  const gpsHandler = new GPSHandler()
  gpsHandler.start()
}

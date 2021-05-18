import GPSHandler from './map/GPSHandler'
import Modal from './Modal'

export default function initMap() {
  const gpsHandler = new GPSHandler()
  gpsHandler.start()

  const modal = new Modal()
}

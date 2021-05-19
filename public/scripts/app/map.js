import GPSHandler from './map/GPSHandler.js'
import Modal from './Modal.js'

export default function initMap () {
  const gpsHandler = new GPSHandler()
  gpsHandler.start()

  const modal = new Modal()
}

import GPSHandler from './map/GPSHandler.js'
import Modal from './Modal.js'

export default function initMap () {
  const gpsHandler = new GPSHandler()
  gpsHandler.setGeolocation()
  gpsHandler.setWakeLock()

  const modal = new Modal()
  modal.openModal()
}

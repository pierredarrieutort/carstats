import LogMobile from '../utils/LogMobile'
import GPSHandler from './map/GPSHandler'

window.app.map = function initMap() {
  new LogMobile()
  new GPSHandler()
}



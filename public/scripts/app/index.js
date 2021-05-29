import initDriving from './driving.js'
import initMap from './map.js'
import initSettings from './settings.js'
import initStatistics from './statistics.js'

import swiper from '../utils/Swiper.js'

window.app = {
  map: initMap,
  driving: initDriving,
  statistics: initStatistics,
  settings: initSettings
}

swiper()

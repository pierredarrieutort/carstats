import initDriving from './driving.js'
import initMap from './map.js'
import initSettings from './settings.js'
import initStatistics from './statistics.js'

import McHammer from '../utils/McHammer.js'

window.app = {
  map: initMap,
  driving: initDriving,
  statistics: initStatistics,
  settings: initSettings
}

const mcHammer = new McHammer()
mcHammer.start()

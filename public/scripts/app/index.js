import initDriving from './driving'
import initMap from './map'
import initSettings from './settings'
import initStatistics from './statistics'

console.log('here0')

window.app = {
  map: initMap,
  driving: initDriving,
  statistics: initStatistics,
  settings: initSettings
}

console.log('here1')

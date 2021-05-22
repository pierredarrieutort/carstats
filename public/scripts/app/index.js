import initDriving from './driving.js'
import initMap from './map.js'
import initSettings from './settings.js'
import initStatistics from './statistics.js'

import Hammer from 'hammerjs'

window.app = {
  map: initMap,
  driving: initDriving,
  statistics: initStatistics,
  settings: initSettings
}

const mc = new Hammer(document.getElementById('page-modal'))

mc.on('panleft', function () { mcHammer('left') })
mc.on('panright', function () { mcHammer('right') })

function mcHammer (direction) {
  mc.stop(true)

  const currentPageButton = document.querySelector('#main-menu .active')
  const leftable = currentPageButton.nextElementSibling
  const rightable = currentPageButton.previousElementSibling

  if (direction === 'left' && leftable) {
    leftable.click()
  } else if (direction === 'right' && rightable) {
    rightable.click()
  }

  mc.stop(false)
}

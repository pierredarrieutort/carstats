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

mc.on('panleft', function () { mcHammer('left', 'settings') })
mc.on('panright', function () { mcHammer('right', 'navigation') })

function mcHammer (direction, maxPageName) {
  mc.stop(true)

  const currentPageButton = document.querySelector('#main-menu .active')
  const [currentPage] = currentPageButton.className.match(/(?<=modal-)[^\s]+/)

  if (direction === 'left' && currentPage !== maxPageName) {
    currentPageButton.nextElementSibling.click()
  } else if (direction === 'right' && currentPage !== maxPageName) {
    currentPageButton.previousElementSibling.click()
  }

  mc.stop(false)
}

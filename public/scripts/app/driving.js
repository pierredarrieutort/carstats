import { StatsApi } from '../utils/Api'

window.app.driving = async function initDriving () {
  const journey = new Journey()
  await journey.fetchRoutes()
  await journey.fetchGlobalStats()
  journey.debug()
  journey.displayRoutes()
}

class Journey {
  constructor () {
    this.statsApi = new StatsApi()

    this.routes = []
    this.globalStats = []

    this.drivingStats = document.querySelector('.driving-stats')
  }

  async fetchRoutes () {
    const response = await this.statsApi.renderLatestRoutes()
    this.routes = await response.json()
  }

  async fetchGlobalStats () {
    const response = await this.statsApi.renderGlobalStats()
    this.globalStats = await response.json()
  }

  displayRoutes () {
    if (this.routes.length === 0) {
      const noData = document.createElement('p')
      noData.innerText = 'No travels founds.'
      this.drivingStats.append(noData)
    } else {
    }
  }

  debug () {
    console.log('routes', this.routes)
    console.log('globalStats', this.globalStats)
  }
}

import { StatsApi } from '../utils/Api'

window.app.driving = async function initDriving () {
  const journey = new Journey()
  await journey.fetchRoutes()
  await journey.fetchGlobalStats()
  journey.debug()
  journey.displayRoutes()
  journey.displayGlobalStats()
}

class Journey {
  constructor () {
    this.statsApi = new StatsApi()

    this.routes = []
    this.globalStats = []

    this.drivingStats = document.querySelector('.driving-stats')
  }

  async fetchRoutes () {
    this.routes = await this.statsApi.renderLatestRoutes()
  }

  async fetchGlobalStats () {
    this.globalStats = await this.statsApi.renderGlobalStats()
  }

  displayGlobalStats() {
    const totalKilometersElement = document.querySelector('.stats-kilometers')
    const maxSpeedElement = document.querySelector('.stats-speed')

    if (this.globalStats) {
      totalKilometersElement.textContent = `${this.globalStats.totalDistance.toLocaleString()} km`
      maxSpeedElement.textContent = `${(this.globalStats.vMax * 3.6).toFixed(0)} km/h`
    }
  }

  displayRoutes () {
    if (this.routes.length === 0) {
      const noData = document.createElement('p')
      noData.textContent = 'No travel found.'
      this.drivingStats.append(noData)
    } else {
    }
  }

  debug () {
    console.log('routes', this.routes)
    console.log('globalStats', this.globalStats)
  }
}

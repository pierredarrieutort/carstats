import { StatsApi } from '../utils/Api'
import CONFIG from '../../../config'

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
      this.routes.forEach(async route => {
        const routeElement = document.createElement('div')
        const travel = document.createElement('p')

        this.drivingStats.append(routeElement)
        routeElement.append(travel)

        const startLatitude = route[0].x
        const startLongitude = route[0].y

        const startResponse = await this.reverseGeocoder(startLongitude, startLatitude)
        console.log(startResponse.features[0].text)

        const endLatitude = route[route.length - 1].x
        const endLongitude = route[route.length - 1].y

        await this.reverseGeocoder(endLongitude, endLatitude)
        console.log(endResponse.features[0].text)
      })
    }
  }

  async reverseGeocoder (lon, lat) {
    const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=${CONFIG.MAPBOXGL.ACCESS_TOKEN}&types=place`)
    return await response.json()
  }

  debug () {
    // console.log('routes', this.routes)
    // console.log('globalStats', this.globalStats)
  }
}

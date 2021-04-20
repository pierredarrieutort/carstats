import dayjs from 'dayjs'
import dayjsDuration from 'dayjs/plugin/duration'
import dayjsRelativeTime from 'dayjs/plugin/relativeTime'

import { StatsApi } from '../utils/Api'
import CONFIG from '../../../config'
import DistanceCalculator from '../app/map/DistanceCalculator'

window.app.driving = async function initDriving() {
  const journey = new Journey()
  await journey.fetchRoutes()
  await journey.fetchGlobalStats()
  journey.debug()
  journey.displayRoutes()
  journey.displayGlobalStats()
}

class Journey {
  constructor() {
    this.statsApi = new StatsApi()

    this.routes = []
    this.globalStats = []

    this.drivingStats = document.querySelector('.driving-stats')
  }

  async fetchRoutes() {
    this.routes = await this.statsApi.renderLatestRoutes()
  }

  async fetchGlobalStats() {
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

  displayRoutes() {
    if (this.routes.length === 0) {
      const noData = document.createElement('p')
      noData.textContent = 'No travel found.'
      this.drivingStats.append(noData)
    } else {
      this.routes.forEach(async route => {
        const routeElement = document.createElement('div')
        const travelName = document.createElement('p')
        const travelDate = document.createElement('p')
        const travelTime = document.createElement('p')
        const travelSpeedMax = document.createElement('p')
        const travelSpeedAvg = document.createElement('p')
        const travelDistance = document.createElement('p')

        travelName.className = 'travel-name'
        travelDate.className = 'travel-date'
        travelTime.className = 'travel-time'
        travelSpeedMax.className = 'travel-speed-max'
        travelSpeedAvg.className = 'travel-speed-avg'
        travelDistance.className = 'travel-distance'

        this.drivingStats.append(routeElement)
        routeElement.append(travelDate, travelTime, travelSpeedMax, travelSpeedAvg, travelDistance, travelName)

        const startLatitude = route[0].x
        const startLongitude = route[0].y
        const startResponse = await this.reverseGeocoder(startLongitude, startLatitude)
        const startPosition = startResponse.features[0].text

        const endLatitude = route[route.length - 1].x
        const endLongitude = route[route.length - 1].y
        const endResponse = await this.reverseGeocoder(endLongitude, endLatitude)
        const endPosition = endResponse.features[0].text

        const date = new Date(route[0].t).toLocaleDateString()

        const startTime = dayjs(route[0].t)
        const endTime = dayjs(route[route.length - 1].t)

        dayjs.extend(dayjsDuration)
        dayjs.extend(dayjsRelativeTime)

        const duration = dayjs.duration(endTime.diff(startTime)).humanize()

        const speedList = route.map(({ v }) => v)

        const speedMax = Math.round((Math.max(...speedList)) * 3.6)
        const speedAvg = Math.round((speedList.reduce((a, b) => a + b) / speedList.length) * 3.6)

        const distanceCalculator = new DistanceCalculator()

        const distancesArray = []

        for (let i = 0; i < route.length - 1; i++) {
          distancesArray.push(distanceCalculator.distance(route[i].x, route[i].y, route[i + 1].x, route[i + 1].y))
        }

        const totalDistance = distancesArray.reduce((a, b) => a + b)

        travelDate.textContent = date

        travelTime.textContent = duration

        travelSpeedMax.textContent = `Max speed: ${speedMax} km`

        travelSpeedAvg.textContent = `Average speed: ${speedAvg} km`

        travelDistance.textContent = `Total distance: ${totalDistance < 1 ? totalDistance.toFixed(2) : Math.round(totalDistance)} km`

        startPosition === endPosition
          ? travelName.textContent = `At ${startPosition}`
          : travelName.textContent = `From ${startPosition} to ${endPosition}`

      })
    }
  }

  async reverseGeocoder(lon, lat) {
    const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=${CONFIG.MAPBOXGL.ACCESS_TOKEN}&types=place`)
    return await response.json()
  }

  debug() {
    // console.log('routes', this.routes)
    // console.log('globalStats', this.globalStats)
  }
}

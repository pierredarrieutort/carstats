import dayjs from 'dayjs/esm/index.js'
import * as dayjsDuration from 'dayjs/plugin/duration.js'
import * as dayjsRelativeTime from 'dayjs/plugin/relativeTime.js'

import { StatsApi } from '../utils/Api.js'
import CONFIG from '../../../config.js'
import DistanceCalculator from '../app/map/DistanceCalculator.js'

export default async function initDriving () {
  const journey = new Journey()
  await journey.fetchRoutes()
  await journey.fetchGlobalStats()
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

  displayGlobalStats () {
    const totalKilometersElement = document.querySelector('.stats-kilometers')
    const maxSpeedElement = document.querySelector('.stats-speed')

    if (this.globalStats) {
      totalKilometersElement.textContent = `${this.globalStats.totalDistance.toLocaleString()} km`
      maxSpeedElement.textContent = `${(this.globalStats.vMax * 3.6).toFixed(0)} km/h`
    }
  }

  displayRoutes () {
    if (this.routes.length === 0) {
      this.noTravelFound()
    } else {
      this.routes.forEach(async route => {
        /**
         * Travel element
         */
        const travelElement = document.createElement('div')

        /**
         * Travel date
         */
        const travelDate = document.createElement('p')
        travelDate.className = 'travel-date'
        const date = new Date(route[0].t).toLocaleDateString()
        travelDate.textContent = date

        /**
         * Travel name
         */
        const startResponse = await this.reverseGeocoder(route[0].y, route[0].x)
        const startPosition = startResponse.features[0]?.text || 'Nowhere'

        const endResponse = await this.reverseGeocoder(route[route.length - 1].y, route[route.length - 1].x)
        const endPosition = endResponse.features[0]?.text || 'Nowhere'

        const travelName = document.createElement('p')
        travelName.className = 'travel-name'

        startPosition === endPosition
          ? travelName.textContent = `At ${startPosition}`
          : travelName.textContent = `From ${startPosition} to ${endPosition}`

        /**
         * Travel info
         */
        const travelInfo = document.createElement('div')

        /**
         * Travel max speed
         */
        const speedList = route.map(({ v }) => v)
        const speedMax = Math.round((Math.max(...speedList)) * 3.6)

        const travelMaxSpeed = document.createElement('div')
        this.createTravelElement(travelMaxSpeed, `${speedMax} km`, 'Max speed')

        /**
         * Travel Average speed
         */
        const speedAvg = Math.round((speedList.reduce((a, b) => a + b) / speedList.length) * 3.6)

        const travelAvgSpeed = document.createElement('div')
        this.createTravelElement(travelAvgSpeed, `${speedAvg} km`, 'Avg speed')

        /**
         * Travel distance
         */
        const distanceCalculator = new DistanceCalculator()
        const distancesArray = []
        for (let i = 0; i < route.length - 1; i++) {
          distancesArray.push(distanceCalculator.distance(route[i].x, route[i].y, route[i + 1].x, route[i + 1].y))
        }
        const totalDistance = distancesArray.reduce((a, b) => a + b)

        const travelDistance = document.createElement('div')
        this.createTravelElement(travelDistance, `${totalDistance < 1 ? totalDistance.toFixed(2) : Math.round(totalDistance)} km`, 'Distance')

        /**
         * Travel duration
         */
        const startTime = dayjs(route[0].t)
        const endTime = dayjs(route[route.length - 1].t)

        dayjs.extend(dayjsDuration)
        dayjs.extend(dayjsRelativeTime)

        const duration = dayjs.duration(endTime.diff(startTime)).humanize()

        const travelDuration = document.createElement('div')
        this.createTravelElement(travelDuration, duration, 'Duration')

        /**
         * Append all on DOM
         */
        this.drivingStats.append(travelElement)
        travelElement.append(travelDate, travelName, travelInfo)
        travelInfo.append(travelMaxSpeed, travelAvgSpeed, travelDistance, travelDuration)
      })
    }
  }

  createTravelElement (element, value, text) {
    const travel = element
    const travelIcon = document.createElement('div')
    const travelValue = document.createElement('p')
    const travelText = document.createElement('span')

    travelValue.textContent = value
    travelText.textContent = text

    travel.append(travelIcon, travelValue, travelText)
  }

  noTravelFound () {
    const noData = document.createElement('p')
    noData.textContent = 'No travel found.'
    this.drivingStats.append(noData)
  }

  async reverseGeocoder (lon, lat) {
    const response = await window.fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=${CONFIG.MAPBOXGL.ACCESS_TOKEN}&types=place`)
    return await response.json()
  }
}

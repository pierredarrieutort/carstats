import { StatsApi } from '../../../utils/Api.js'
import DistanceCalculator from './DistanceCalculator.js'

export default class NavigationWatcher {
  constructor () {
    this.statsApi = new StatsApi()
    this.distanceCalculator = new DistanceCalculator()

    this.globalStatsId = null
    this.userMaxSpeed = 0

    this.latestCoords = {
      lat: 0,
      lon: 0
    }

    this.timeCheck = new Date()
    this.userTotalDistance = 0
    this.userTotalDuration = 0

    setInterval(this.travelAndDurationUpdate.bind(this), 60000)
  }

  async update ({ latitude, longitude, speed = 0 }) {
    if (!this.globalStatsId) {
      await this.getUserGlobalStats()
    }

    document.getElementById('speedometer-value').textContent = parseInt(speed * 3.6)

    this.vMaxUpdate(speed)
    this.totalDistanceUpdate(latitude, longitude)
    this.totalTravelDurationUpdate()

    // TODO - link a real variable
    // if (isTraveling) {
    //   this.travelWatcher(speed, latitude, longitude)
    // }
  }

  /**
   * @description Retrieves current user's global stats.
   */
  async getUserGlobalStats () {
    const { id, vMax, totalDistance, totalTravelDuration } = await this.statsApi.renderGlobalStats()

    this.globalStatsId = id
    this.userMaxSpeed = vMax
    this.userTotalDistance = totalDistance
    this.userTotalDuration = totalTravelDuration
  }

  vMaxUpdate (speed) {
    if (speed > this.userMaxSpeed) {
      this.statsApi.updateGlobalStats(this.globalStatsId, {
        vMax: Math.round((speed + Number.EPSILON) * 100) / 100
      })
    }
  }

  totalDistanceUpdate (newLat, newLon) {
    // Calculates distance between latest coords.
    const traveledDistance = this.distanceCalculator.distance(
      this.latestCoords.lat,
      this.latestCoords.lon,
      newLat,
      newLon
    )

    // Updates latest coords.
    this.latestCoords = {
      lat: newLat,
      lon: newLon
    }

    // Increment total traveled distance.
    this.userTotalDistance += traveledDistance
  }

  totalTravelDurationUpdate () {
    const internalTimeCheck = new Date()

    const dateDiff = this.timeCheck - internalTimeCheck

    this.userTotalDuration += dateDiff
  }

  travelAndDurationUpdate () {
    if (!this.userTotalDistance || !this.userTotalDuration) {
      this.statsApi.updateGlobalStats(this.globalStatsId, {
        totalDistance: this.userTotalDistance,
        totalTravelDuration: this.userTotalDuration
      })
    }
  }
}

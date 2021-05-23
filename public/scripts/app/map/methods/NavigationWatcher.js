import { StatsApi, MapApi } from '../../../utils/Api.js'
import DistanceCalculator from './DistanceCalculator.js'

export default class NavigationWatcher {
  constructor () {
    this.mapApi = new MapApi()
    this.distanceCalculator = new DistanceCalculator()

    this.globalStatsId = null
    this.userMaxSpeed = null

    this.latestCoords = {
      lat: null,
      lon: null
    }

    // TODO - setInterval to send updates if changed
  }

  async update (gps) {
    if (!this.globalStatsId) {
      await this.getUserGlobalStats()
    }

    const { latitude, longitude, speed = 0 } = gps.coords

    document.getElementById('speedometer-value').textContent = parseInt(speed * 3.6)

    this.vMaxUpdate(speed)
    this.vMoyUpdate()
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
    const statsApi = new StatsApi()
    const { vMax, id, totalDistance } = await statsApi.renderGlobalStats()

    this.globalStatsId = id
    this.userMaxSpeed = vMax
    this.userTotalDistance = totalDistance
  }

  vMaxUpdate (speed) {
    if (speed > this.userMaxSpeed) {
      this.mapApi.updateMaxSpeed(this.globalStatsId, speed)
    }
  }

  vMoyUpdate () {

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

  }
}

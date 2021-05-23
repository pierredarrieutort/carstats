import { StatsApi } from '../../../utils/Api.js'
import DistanceCalculator from './DistanceCalculator.js'

export default class NavigationWatcher {
  constructor () {
    this.statsApi = new StatsApi()
    this.distanceCalculator = new DistanceCalculator()

    this.globalStatsId = null
    this.userMaxSpeed = 0

    this.latestCoords = {
      lat: NaN,
      lon: NaN
    }

    this.timeCheck = new Date()
    this.userTotalDistance = 0
    this.userTotalDuration = 0

    setInterval(this.travelAndDurationUpdate.bind(this), 15000)
  }

  async update ({ latitude, longitude, speed = 0 }) {
    if (!this.globalStatsId) {
      await this.getUserGlobalStats()
    }

    document.getElementById('speedometer-value').textContent = parseInt(speed * 3.6)

    this.vMaxUpdate(speed)
    this.totalDistanceUpdate(latitude, longitude)

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
    this.userTotalDuration = parseInt(totalTravelDuration)
  }

  vMaxUpdate (speed) {
    if (speed > this.userMaxSpeed) {
      this.statsApi.updateGlobalStats(this.globalStatsId, {
        vMax: Math.round((speed + Number.EPSILON) * 100) / 100
      })
    }
  }

  totalDistanceUpdate (newLat, newLon) {
    // Prevents geolocation issues by aggregating and function stop.
    if (isNaN(this.latestCoords.lat) || isNaN(this.latestCoords.lon)) {
      this.latestCoords = {
        lat: newLat,
        lon: newLon
      }

      return
    }

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

    const dateDiff = internalTimeCheck - this.timeCheck
    this.timeCheck = internalTimeCheck

    this.userTotalDuration += dateDiff / 1000
  }

  travelAndDurationUpdate () {
    this.totalTravelDurationUpdate()

    if (this.globalStatsId) {
      this.statsApi.updateGlobalStats(this.globalStatsId, {
        totalDistance: Math.round(this.userTotalDistance),
        totalTravelDuration: this.userTotalDuration
      })
    }
  }

  travelWatcher (speed, latitude, longitude) {
    /**
     * @param  {Float} v Speed in m/s
     * @param  {Float} x Latitude
     * @param  {Float} y Longitude
     * @param  {String} t Timestamp as ISO 8601 UTC
     */
    this.travel.route.push({
      v: speed,
      x: latitude,
      y: longitude,
      t: new Date().toISOString()
    })

    /*
    TODO - Determine when a travel is ended.
    TODO - At travel end, send this.travel do db.
    TODO - On travel end, reset this.travel.
    TODO - On travel, at app close, send latest data
    TODO - Continuously send and clean data to lighten `this.travel` Object and get a trace of a travel piece
    */
  }
}

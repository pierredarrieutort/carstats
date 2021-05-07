import mapboxgl from 'mapbox-gl'
import MapboxDirections from '@mapbox/mapbox-gl-directions'

import { io } from 'socket.io-client'

import CONFIG from '../../../../config'
import DistanceCalculator from './DistanceCalculator'

import mapDirectionsStyles from './mapDirectionsStyles'

export default class GPSHandler {

  constructor() {
    mapboxgl.accessToken = CONFIG.MAPBOXGL.ACCESS_TOKEN

    // TODO try to replace first get position by that
    this.geolocate = new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true
    })

    this.gps = {}
    this.gpsOptions = {
      // enableHighAccuracy: false 
    }

    this.map = null
    this.mapDirections = null

    this.socket = io()

    this.deviceMarkers = []

    this.travel = []
    this.traveledDistance = 0

    this.lastPosition = {
      latitude: NaN,
      longitude: NaN
    }

    this.getLocation()
  }

  getLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(this.gpsInitialization.bind(this), this.error, this.gpsOptions)
      navigator.geolocation.watchPosition(this.gpsHandler.bind(this), this.error, this.gpsOptions)
    } else {
      this.error('Geolocation is not supported by this browser.')
    }
  }

  gpsInitialization(data) {
    this.gps = data
    this.createMap()
  }

  gpsHandler(data) {
    this.gps = data
    this.travelWatcher()
    this.socketHandler()
  }

  createMap() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: CONFIG.MAPBOXGL.STYLE,
      center: [this.gps.coords.longitude, this.gps.coords.latitude],
      zoom: 10
    })

    this.addGeolocateControl()
    this.addMapDirections()
    this.removeMapDirectionsInstruction()
  }

  addGeolocateControl() {
    this.map.addControl(this.geolocate)
    this.map.on('load', () => this.geolocate.trigger())
  }

  addMapDirections() {
    this.mapDirections =
      new MapboxDirections({
        accessToken: CONFIG.MAPBOXGL.ACCESS_TOKEN,
        styles: mapDirectionsStyles,
        unit: 'metric',
        language: 'fr',
        interactive: false,
        alternatives: true,
        controls: {
          instructions: false,
          profileSwitcher: false
        }
      })
        .setOrigin([this.gps.coords.longitude, this.gps.coords.latitude])
        .on('route', data => {
          document.querySelector('.map').classList.add('active')

          this.mapDirectionsTotal(data)
        })

    this.map.addControl(this.mapDirections, 'top-left')
  }

  mapDirectionsTotal(data) {
    const totalDistance = document.querySelector('.map-distance')
    const stepDistance = document.querySelector('.map-step-distance')

    let distanceValue = data.route[0].distance
    if (distanceValue < '1000') totalDistance.innerText = `${distanceValue.toFixed(0)} m`
    else totalDistance.innerText = `${(distanceValue / 1000).toFixed(1)} km`

    document.querySelector('.map-duration').innerText = this.convertSecondsToDuration(data.route[0].duration)

    let stepDistanceValue = data.route[0].legs[0].steps[0].distance
    if (stepDistanceValue < '1000') stepDistance.innerText = `${stepDistanceValue.toFixed(0)} m`
    else stepDistance.innerText = `${(stepDistanceValue / 1000).toFixed(1)} km`

    document.querySelector('.map-step-instruction').innerText = data.route[0].legs[0].steps[0].maneuver.instruction
  }

  removeMapDirectionsInstruction() {
    const removeRouteButton = document.querySelectorAll('.geocoder-icon-close')
    removeRouteButton.forEach(removeBtn => {
      removeBtn.addEventListener('click', () => {
        removeRouteButton[0].click()
        document.querySelector('.map').classList.remove('active')
        this.map.flyTo({
          center: [
            this.gps.coords.longitude,
            this.gps.coords.latitude
          ],
          essential: true
        })
        this.geolocate.trigger()
      })
    })

    document.querySelector('.mapbox-directions-destination input').addEventListener('input', this.directionsInputHandler.bind(this))
  }

  directionsInputHandler(e) {
    const removeRouteButton = document.querySelectorAll('.geocoder-icon-close')
    const directionsOrigin = document.querySelector('.mapbox-directions-origin input')

    if (e.target.value.length === 0) {
      removeRouteButton.forEach(el => el.click())
    }

    if (directionsOrigin.value.length === 0) {
      directionsOrigin.value = `${this.gps.coords.longitude}, ${this.gps.coords.latitude}`
      this.mapDirections.setOrigin([this.gps.coords.longitude, this.gps.coords.latitude])
    }
  }

  convertSecondsToDuration(timeInSeconds) {
    let
      hrs = ~~(timeInSeconds / 3600),
      mins = ~~((timeInSeconds % 3600) / 60)

    let timerString = ''

    if (hrs > 0) timerString += `${hrs} h ${mins < 10 ? '0' : ''}`

    timerString += `${mins} min`

    return timerString
  }

  travelWatcher() {
    const speed = this.gps.coords?.speed || 0
    const { latitude, longitude } = this.gps.coords

    /**
     * @param  {Float} v Speed in m/s
     * @param  {Float} x Latitude
     * @param  {Float} y Longitude
     * @param  {String} t Timestamp as ISO 8601 UTC
     */
    this.travel.push({
      v: speed,
      x: latitude,
      y: longitude,
      t: new Date().toISOString()
    })

    /*
    TODO - Calculate current Distance from start.
    TODO - Determine when a travel is ended.
    TODO - At travel end, send this.travel do db.
    TODO - If totalDistance or MaxSpeed are overtaken, update them in DB.
    TODO - On travel end, reset this.travel & this.traveledDistance.
    TODO - Display on current travel total Distance from start (optional)
    */
    // console.log(this.travel, this.gps.coords)
    document.getElementById('speedometer-value').textContent = parseInt(speed * 3.6)
    new DistanceCalculator().distance(51.5, 0, 38.8, -77.1)
  }

  socketHandler() {
    this.onSendPosition()
    this.onReceivePosition()
  }

  /**
   * Send user position to the server
   */
  onSendPosition() {
    const { latitude: lastLat, longitude: lastLon } = this.lastPosition
    const { latitude: gpsLat, longitude: gpsLon } = this.gps.coords

    // if (lastLat !== gpsLat || lastLon !== gpsLon) {
    this.socket.emit('sendPosition', [gpsLat, gpsLon])
    this.lastPosition.latitude = gpsLat
    this.lastPosition.longitude = gpsLon
    // }
  }

  onReceivePosition() {
    /**
     * Remove current user position to avoid duplicates
     */
    this.socket.on('usersPosition', usersPosition => {
      const userId = JSON.parse(atob(document.cookie.split('jwt=')[1].split('.')[1].replace('-', '+').replace('_', '/'))).id
      delete usersPosition[userId]

      const existingMarkers = this.deviceMarkers.map(({ _element }) => _element.id)
      const existingMarkersFiltered = existingMarkers.filter(el => el != null)

      Object.entries(usersPosition).forEach(([id, [lat, lon]]) => {
        if (existingMarkersFiltered.includes(`marker${id}`)) {
          this.updateMarker(id, { lat, lon })
        } else {
          this.createMarker(id, { lat, lon })
        }
      })

      this.socket.on('deleteMarker', userId => {
        this.deviceMarkers.forEach(marker => {
          if (marker._element.id === `marker${userId}`) {
            marker.remove()
          }
        })

        const indexToDelete = this.deviceMarkers.findIndex(marker => {
          if (typeof marker !== 'undefined') {
            return marker._element.id === `marker${userId}`
          }
        })
        delete this.deviceMarkers[indexToDelete]
      })

    })
  }

  /**
   * Creates User's marker on map
   */
  createMarker(id, coords) {
    const markerDOM = document.createElement('div')
    markerDOM.className = 'marker'
    markerDOM.id = `marker${id}`

    const glMarker = new mapboxgl
      .Marker(markerDOM)
      .setLngLat(coords)
      .addTo(this.map)

    this.deviceMarkers.push(glMarker)
  }

  /**
   * Update user's position on map
   */
  updateMarker(id, coords) {
    const deviceMarkersFiltered = this.deviceMarkers.filter(el => el != null)
    const indexToUpdate = deviceMarkersFiltered.findIndex(({ _element }) => _element.id = `marker${id}`)
    deviceMarkersFiltered[indexToUpdate].setLngLat(coords)
  }

  error(err) {
    console.error(`ERROR (${err?.code}): ${err?.message}`)
  }

}

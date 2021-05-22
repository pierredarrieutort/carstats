import CONFIG from '../../../../config.js'
import DistanceCalculator from './DistanceCalculator.js'

import mapboxgl from 'mapbox-gl'
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions'
import mapDirectionsStyles from './mapDirectionsStyles.js'

import SpeedLimit from './speedLimit.js'
import PoiManager from './pointsOfInterest.js'

import { io } from 'socket.io-client'

export default class GPSHandler {
  constructor () {
    mapboxgl.accessToken = CONFIG.MAPBOXGL.ACCESS_TOKEN

    this.mapboxGeolocateElement = document.querySelector('.mapboxgl-ctrl.mapboxgl-ctrl-group')

    this.gps = {}
    this.gpsOptions = {
      enableHighAccuracy: true
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

    this.speedLimit = new SpeedLimit()
  }

  start () {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(this.gpsInitialization.bind(this), this.error, this.gpsOptions)
      navigator.geolocation.watchPosition(this.gpsHandler.bind(this), this.error, this.gpsOptions)
    } else {
      this.error('Geolocation is not supported by this browser.')
    }

    if ('wakeLock' in navigator) {
      navigator.wakeLock.request('screen')
    }
  }

  gpsInitialization (data) {
    this.gps = data
    this.createMap()

    const poiManager = new PoiManager(this.map)
    poiManager.start()

    this.speedLimit.createComponent(this.gps.coords)
  }

  gpsHandler (data) {
    this.gps = data
    this.travelWatcher()
    this.socketHandler()
    this.speedLimit.updateSpeedLimit(this.gps.coords)
    this.map.rotateTo(this.gps.coords.heading, {
      duration: 1000,
      animate: true,
      essential: true
    })
    this.mapDirections.setOrigin([this.gps.coords.longitude, this.gps.coords.latitude])
  }

  createMap () {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: CONFIG.MAPBOXGL.STYLE,
      center: [this.gps.coords.longitude, this.gps.coords.latitude],
      zoom: 19,
      minZoom: 4,
      maxZoom: 20
    })

    this.addGeolocateControl()
    this.addMapDirections()
    this.removeMapDirectionsInstruction()
  }

  addGeolocateControl () {
    this.geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
      // fitBoundsOptions: { linear: true, minZoom: 19 }
    })

    this.map.addControl(this.geolocate)

    this.geolocate.trigger()
  }

  addMapDirections () {
    this.mapDirections = new MapboxDirections({
      accessToken: CONFIG.MAPBOXGL.ACCESS_TOKEN,
      styles: mapDirectionsStyles,
      unit: 'metric',
      language: 'en',
      routePadding: { top: 420, bottom: 240, left: 120, right: 120 },
      interactive: false,
      alternatives: false,
      controls: {
        profileSwitcher: false,
        instructions: false
      }
    })
      .setOrigin([this.gps.coords.longitude, this.gps.coords.latitude])
      .on('route', data => {
        if (data.route.length) {
          this.travelInfo(data)
          document.querySelector('.map-recap').classList.add('active')
          document.querySelector('#mapbox-directions-destination-input .mapboxgl-ctrl-geocoder input').style.borderRadius = '6px 6px 0 0'
          document.querySelector('.map-recap .btn').addEventListener('click', () => {
            this.map.flyTo({
              center: [
                this.gps.coords.longitude,
                this.gps.coords.latitude
              ],
              zoom: 19
            })
            document.querySelector('.map-recap').classList.remove('active')
            document.querySelector('#mapbox-directions-destination-input .mapboxgl-ctrl-geocoder input').style.borderRadius = '6px'
            this.mapDirectionsTotal(data)
            document.querySelector('.map').classList.add('active')
            document.getElementById('map').classList.add('isTraveling')
          })
        }
      })
      .on('error', () => {
        // document.querySelector('.map').classList.remove('active')
      })

    this.map.addControl(this.mapDirections, 'top-left')
  }

  mapDirectionsTotal (data) {
    const icon = document.querySelector('.map-step-icon')
    const stepDistance = document.querySelector('.map-step-distance')
    const stepTime = document.querySelector('.map-step-time')

    if (data.route.length !== 0) {
      icon.classList.add(`icon-${data.route[0].legs[0].steps[0].maneuver.modifier}`)

      const stepDistanceValue = data.route[0].legs[0].steps[0].distance
      if (stepDistanceValue < '1000') stepDistance.innerText = `${stepDistanceValue.toFixed(0)} m`
      else stepDistance.innerText = `${(stepDistanceValue / 1000).toFixed(1)} km`

      stepTime.innerText = `(${this.convertSecondsToDuration(data.route[0].legs[0].steps[0].duration)})`

      document.querySelector('.map-step').classList.add(data.route[0].legs[0].steps[0].maneuver.type)
      document.querySelector('.map-step-instruction').innerText = data.route[0].legs[0].steps[0].maneuver.instruction
    }
  }

  travelInfo (data) {
    const route = data.route[0]

    const travelDuration = document.querySelector('.map-recap-duration')
    const travelDistance = document.querySelector('.map-recap-distance')
    const travelTime = document.querySelector('.map-recap-time')
    const mapFrom = document.querySelector('.map-recap-from span')
    const mapTo = document.querySelector('.map-recap-to span')

    travelDuration.innerText = this.convertSecondsToDuration(route.duration)

    if (route.distance < '1000') travelDistance.innerText = `(${route.distance.toFixed(0)} m)`
    else travelDistance.innerText = `(${(route.distance / 1000).toFixed(1)} km)`

    const date = new Date()
    date.setSeconds(date.getSeconds() + route.duration)
    travelTime.innerText = new Intl.DateTimeFormat('fr-FR', { hour: 'numeric', minute: 'numeric' }).format(date)

    mapFrom.innerText = route.legs[0].steps.shift().name || 'Nowhere'
    mapTo.innerText = route.legs[0].steps.pop().name || 'Nowhere'
  }

  removeMapDirectionsInstruction () {
    const removeRouteButton = document.querySelectorAll('.geocoder-icon-close')
    removeRouteButton.forEach(removeBtn => {
      removeBtn.addEventListener('click', () => {
        this.geolocate.trigger()
        document.querySelector('.map').classList.remove('active')
        document.querySelector('.map-recap').classList.remove('active')
        document.getElementById('map').classList.remove('isTraveling')
      })
    })

    document.querySelector('.mapbox-directions-destination input').addEventListener('input', this.directionsInputHandler.bind(this))
  }

  directionsInputHandler (e) {
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

  convertSecondsToDuration (timeInSeconds) {
    const hrs = ~~(timeInSeconds / 3600)
    const mins = ~~((timeInSeconds % 3600) / 60)

    let timerString = ''

    if (hrs > 0) timerString += `${hrs} h ${mins < 10 ? '0' : ''}`

    timerString += `${mins} min`

    return timerString
  }

  travelWatcher () {
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

  socketHandler () {
    this.onSendPosition()
    this.onReceivePosition()
  }

  /**
   * Send user position to the server
   */
  onSendPosition () {
    const { latitude: gpsLat, longitude: gpsLon } = this.gps.coords

    this.socket.emit('sendPosition', [gpsLat, gpsLon])
    this.lastPosition.latitude = gpsLat
    this.lastPosition.longitude = gpsLon
  }

  onReceivePosition () {
    /**
     * Remove current user position to avoid duplicates
     */
    this.socket.on('usersPosition', usersPosition => {
      const userId = JSON.parse(window.atob(document.cookie.split('jwt=')[1].split('.')[1].replace('-', '+').replace('_', '/'))).id
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

        const indexToDelete = this.deviceMarkers.findIndex(function (marker) {
          if (typeof marker !== 'undefined') {
            return marker._element.id === `marker${userId}`
          }
          return false
        })
        delete this.deviceMarkers[indexToDelete]
      })
    })
  }

  /**
   * Creates User's marker on map
   */
  createMarker (id, coords) {
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
  updateMarker (id, coords) {
    const indexToUpdate = this.deviceMarkers.findIndex(({ _element }) => _element.id === `marker${id}`)
    this.deviceMarkers[indexToUpdate].setLngLat(coords)
  }

  error (err) {
    console.error(`ERROR (${err?.code}) : ${err?.message}`)
  }
}

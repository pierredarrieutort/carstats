import CONFIG from '../../../../config.js'

import mapboxgl from 'mapbox-gl'
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions'
import mapDirectionsStyles from './mapDirectionsStyles.js'

import { io } from 'socket.io-client'

import Utils from './methods/Utils.js'
import SpeedLimit from './speedLimit.js'
import PoiManager from './pointsOfInterest.js'
import NavigationWatcher from './methods/NavigationWatcher.js'

const utils = new Utils()

export default class GPSHandler {
  constructor () {
    this.token = CONFIG.MAPBOXGL.ACCESS_TOKEN
    this.mapStyle = CONFIG.MAPBOXGL.STYLE

    this.gps = {}
    this.gpsOptions = {
      enableHighAccuracy: true
    }

    this.latestBearing = 0
    this.easing = false

    this.map = null

    this.geolocate = null
    this.directions = null

    this.mapData = document.getElementById('map-data')
    this.mapStep = document.getElementById('map-step')
    this.mapError = document.getElementById('map-error')
    this.mapStart = document.getElementById('map-data-start')

    this.speedLimit = new SpeedLimit()

    this.socket = io()
    this.deviceMarkers = []
  }

  gpsInitialization (data) {
    this.gps = data

    this.createMap()

    const poiManager = new PoiManager(this.map)
    poiManager.start()

    this.speedLimit.createComponent(this.gps.coords)
  }

  updateUserPosition (data) {
    this.gps = data

    this.socketHandler()

    this.map.getZoom()

    this.setOrientationListener(this.gps.coords.heading)

    const navigationWatcher = new NavigationWatcher()
    navigationWatcher.update(this.gps.coords)

    this.speedLimit.updateSpeedLimit(this.gps.coords)

    if (this.mapData.hasAttribute('data-active')) {
      this.setOriginDirections()
    }

    if (this.mapStep.hasAttribute('data-active')) {
      this.setOriginDirections()
      this.geolocate.trigger()
    }
  }

  setGeolocation () {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(this.gpsInitialization.bind(this), this.error, this.gpsOptions)
      navigator.geolocation.watchPosition(this.updateUserPosition.bind(this), this.error, this.gpsOptions)
    } else {
      console.error('Geolocation is not supported by this browser.')
    }
  }

  setWakeLock () {
    if ('wakeLock' in navigator) {
      navigator.wakeLock.request('screen')
    } else {
      console.error('WakeLock is not supported by this browser.')
    }
  }

  setOrientationListener (heading) {
    document.getElementById('legalSpeed').textContent = Math.round(heading)
    document.getElementById('legalSpeed').style.color = 'red'

    setTimeout(() => {
      document.getElementById('legalSpeed').removeAttribute('style')
    }, 500)
    // if (!this.easing) {
    //   const freshBearing = heading < 180
    //     ? heading
    //     : -heading + 180

    //   const bearingEase = () => {
    //     if (this.latestBearing !== freshBearing) {
    //       freshBearing > this.latestBearing
    //         ? this.map.setBearing(++this.latestBearing)
    //         : this.map.setBearing(--this.latestBearing)
    //       window.requestAnimationFrame(bearingEase)
    //     } else { this.easing = false }
    //   }

    //   const min = this.latestBearing - 10
    //   const max = this.latestBearing + 10
    //   if (freshBearing < min || freshBearing > max) {
    //     this.easing = true
    //     window.requestAnimationFrame(bearingEase)
    //   }
    // }
  }

  createMap () {
    mapboxgl.accessToken = this.token

    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.mapStyle,
      center: [this.gps.coords.longitude, this.gps.coords.latitude],
      zoom: 18,
      minZoom: 5,
      maxZoom: 20,
      pitch: 60
    })

    this.geolocateUser()
  }

  geolocateUser () {
    this.geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      showAccuracyCircle: false,
      trackUserLocation: true
    })

    this.map.addControl(this.geolocate)

    this.map.on('load', () => {
      this.geolocate.trigger()

      this.addDirections()

      this.map.addLayer({
        id: 'sky',
        type: 'sky',
        paint: {
          'sky-type': 'atmosphere'
        }
      })

      document.querySelector('.mapboxgl-ctrl-bottom-left').remove()
      document.querySelector('.mapboxgl-ctrl-bottom-right').remove()
      document.querySelector('.mapbox-directions-origin').remove()
      document.querySelector('.directions-icon.directions-icon-reverse.directions-reverse').remove()
      document.querySelector('.mapbox-form-label').remove()
    })
  }

  addDirections () {
    this.directions = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      styles: mapDirectionsStyles,
      interactive: false,
      profile: 'mapbox/driving-traffic',
      unit: 'metric',
      routePadding: { top: 420, bottom: 240, left: 120, right: 120 },
      controls: {
        instructions: false,
        profileSwitcher: false
      }
    })

    this.setOriginDirections()
    this.onRouteDirections()
    this.onErrorDirections()

    this.map.addControl(this.directions, 'top-left')
  }

  setOriginDirections () {
    this.directions.setOrigin([this.gps.coords.longitude, this.gps.coords.latitude])
  }

  onRouteDirections (routeData) {
    this.directions.on('route', route => {
      this.clearErrorDirections()

      const geolocate = document.querySelector('.mapboxgl-ctrl-geolocate')

      document.querySelector('.geocoder-icon.geocoder-icon-close').addEventListener('click', () => {
        if (!geolocate.classList.contains('mapboxgl-ctrl-geolocate-active')) {
          this.geolocate.trigger()
          this.map.scrollZoom.enable()
        }

        this.clearErrorDirections()

        this.mapData.removeAttribute('data-active')
        this.mapStep.removeAttribute('data-active')
      })

      routeData = route.route[0]

      if (routeData) {
        this.getTravelInformations(routeData)

        if (this.mapStep.hasAttribute('data-active')) {
          this.setStepTravelInformations(routeData)
        }

        this.mapStart.addEventListener('click', () => {
          if (!geolocate.classList.contains('mapboxgl-ctrl-geolocate-active')) {
            this.geolocate.trigger()
          }

          this.setStepTravelInformations(routeData)
        })
      }
    })
  }

  getTravelInformations (routeData) {
    this.mapData.setAttribute('data-active', true)

    document.getElementById('map-data-duration').textContent = utils.convertSecondsToDuration(routeData.duration)

    const mapDataDistance = document.getElementById('map-data-distance')
    routeData.distance < 1000
      ? mapDataDistance.textContent = `(${routeData.distance.toFixed(0)} m)`
      : mapDataDistance.textContent = `(${(routeData.distance / 1000).toFixed(1)} km)`

    const date = new Date()
    date.setSeconds(date.getSeconds() + routeData.duration)
    document.getElementById('map-data-time').textContent = new Intl.DateTimeFormat('fr-FR', { hour: 'numeric', minute: 'numeric' }).format(date)

    document.querySelector('#map-data-origin span').textContent = routeData.legs[0].steps.shift().name || 'Undefined place'

    document.querySelector('#map-data-destination span').textContent = routeData.legs[0].steps.pop().name || 'Undefined place'
  }

  getStepTravelInformations (routeData) {
    this.mapStep.setAttribute('data-active', true)

    const routeDataStep = routeData.legs[0].steps[0]

    document.getElementById('map-step-icon').classList.add(`icon-${(routeDataStep.maneuver.modifier).replace(/\s+/g, '-')}`)

    const mapStepDistance = document.getElementById('map-step-distance')
    const mapStepDistanceValue = routeDataStep.distance

    mapStepDistanceValue < 1000
      ? mapStepDistance.textContent = `${mapStepDistanceValue.toFixed(0)} m`
      : mapStepDistance.textContent = `${(mapStepDistanceValue / 1000).toFixed(1)} km`

    document.getElementById('map-step-time').textContent = `(${utils.convertSecondsToDuration(routeDataStep.duration)})`

    document.getElementById('map-step').classList.add(routeDataStep.maneuver.type)
    document.getElementById('map-step-instruction').textContent = routeDataStep.maneuver.instruction
  }

  setStepTravelInformations (routeData) {
    this.mapData.removeAttribute('data-active')

    this.getStepTravelInformations(routeData)
  }

  onErrorDirections () {
    this.directions.on('error', error => {
      this.mapError.setAttribute('data-active', true)
      this.mapError.textContent = error.error

      this.map.flyTo({ center: [this.gps.coords.longitude, this.gps.coords.latitude], zoom: 19 })
    })
  }

  clearErrorDirections () {
    this.mapError.removeAttribute('data-active')
    this.mapError.textContent = ''
  }

  socketHandler () {
    this.onSendPosition()
    this.onReceivePosition()
  }

  onSendPosition () {
    this.socket.emit('sendPosition', [this.gps.coords.latitude, this.gps.coords.longitude])
  }

  onReceivePosition () {
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

  updateMarker (id, coords) {
    const indexToUpdate = this.deviceMarkers.findIndex(({ _element }) => _element.id === `marker${id}`)
    this.deviceMarkers[indexToUpdate].setLngLat(coords)
  }

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

  error (err) {
    return console.error(
      typeof err === 'string'
        ? err
        : `ERROR (${err?.code}) : ${err?.message}`
    )
  }
}

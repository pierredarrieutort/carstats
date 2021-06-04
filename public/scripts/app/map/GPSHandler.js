import CONFIG from '../../../../config.js'

import mapboxgl from 'mapbox-gl'
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions'
import mapDirectionsStyles from './mapDirectionsStyles.js'

import { io } from 'socket.io-client'

import Utils from './methods/Utils.js'
import SpeedLimit from './speedLimit.js'
import PoiManager from './pointsOfInterest.js'
import NavigationWatcher from './methods/NavigationWatcher.js'
import DistanceCalculator from './methods/DistanceCalculator.js'
import { FriendsApi } from '../../utils/Api.js'

const utils = new Utils()

export default class GPSHandler {
  constructor () {
    this.token = CONFIG.MAPBOXGL.ACCESS_TOKEN
    this.mapStyle = CONFIG.MAPBOXGL.STYLE

    this.gps = {}
    this.gpsOptions = {
      enableHighAccuracy: true
    }

    this.coordsValidator = []
    this.latestBearing = 0
    this.traveledDistance = 0

    this.map = null

    this.geolocate = null
    this.directions = null

    this.mapData = document.getElementById('map-data')
    this.mapStep = document.getElementById('map-step')
    this.mapError = document.getElementById('map-error')
    this.mapStart = document.getElementById('map-data-start')

    this.speedLimit = new SpeedLimit()
    this.distanceCalculator = new DistanceCalculator()
    this.friendsApi = new FriendsApi()
    this.navigationWatcher = new NavigationWatcher()

    this.socket = io()
    this.deviceMarkers = []

    this.joiningFriend = ''
  }

  gpsInitialization (data) {
    this.gps = data

    this.createMap()

    const poiManager = new PoiManager(this.map, this.gps)
    poiManager.start()

    this.speedLimit.createComponent(this.gps.coords)

    setInterval(() => {
      this.coordsValidator = [this.gps.coords.longitude, this.gps.coords.latitude]
    }, 1000)
  }

  updateUserPosition (data) {
    this.gps = data

    this.socketHandler()

    this.map.getZoom()

    this.navigationWatcher.update(this.gps.coords)

    this.speedLimit.updateSpeedLimit(this.gps.coords)

    if (this.mapData.hasAttribute('data-active')) {
      this.setOriginDirections()
    }

    this.traveledDistance = this.distanceCalculator.distance(
      this.coordsValidator[1],
      this.coordsValidator[0],
      this.gps.coords.latitude,
      this.gps.coords.longitude
    )

    if (this.traveledDistance > 0.002) {
      this.setTrigger(Math.round(this.gps.coords.heading))
    }

    if (this.mapStep.hasAttribute('data-active')) {
      this.setOriginDirections()
      this.setTrigger(Math.round(this.gps.coords.heading))
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

  setTrigger (heading) {
    this.map.easeTo({
      center: [this.gps.coords.longitude, this.gps.coords.latitude],
      bearing: heading,
      zoom: 19,
      duration: 400,
      options: {
        essentials: true
      }
    })
  }

  createMap () {
    mapboxgl.accessToken = this.token

    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.mapStyle,
      center: [this.gps.coords.longitude, this.gps.coords.latitude],
      zoom: 18,
      minZoom: 8,
      maxZoom: 20,
      pitch: 60,
      maxPitch: 60
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

      this.map.doubleClickZoom.disable()
      this.map.keyboard.disable()

      this.addDirections()

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
        document.body.classList.remove('isTravelling')
      })

      routeData = route.route[0]

      if (routeData) {
        this.getTravelInformations(routeData)

        if (this.mapStep.hasAttribute('data-active')) {
          this.setStepTravelInformations(routeData)
        }

        this.mapStart.addEventListener('click', () => {
          if (!geolocate.classList.contains('mapboxgl-ctrl-geolocate-active')) {
            this.setTrigger(Math.round(this.gps.coords.heading))
          }

          document.body.classList.add('isTravelling')

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

    routeData.legs[0].steps.shift().name
      ? document.querySelector('#map-data-origin span').textContent = routeData.legs[0].steps.shift().name
      : document.getElementById('map-data-origin').style.display = 'none'

    routeData.legs[0].steps.pop().name
      ? document.querySelector('#map-data-destination span').textContent = routeData.legs[0].steps.pop().name
      : document.getElementById('map-data-destination').style.display = 'none'
  }

  getStepTravelInformations (routeData) {
    this.mapStep.setAttribute('data-active', true)

    document.getElementById('map-step-recap-duration').textContent = utils.convertSecondsToDuration(routeData.duration)

    const date = new Date()
    date.setSeconds(date.getSeconds() + routeData.duration)
    document.getElementById('map-step-recap-time').textContent = new Intl.DateTimeFormat('fr-FR', { hour: 'numeric', minute: 'numeric' }).format(date)

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
        this.modal(id, usersPosition)
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
    const indexToUpdate = this.deviceMarkers.findIndex(e => e?._element.id === `marker${id}`)

    if (indexToUpdate !== -1) {
      this.deviceMarkers[indexToUpdate].setLngLat(coords)

      if (this.joiningFriend === id) {
        this.directions.setDestination([coords.lon, coords.lat])
      }

      const DOMMarker = this.deviceMarkers[indexToUpdate]._element

      if (!DOMMarker.classList.contains('isFriendChecked')) {
        this.friendMarker(id, DOMMarker)
        DOMMarker.classList.add('isFriendChecked')
        window.setTimeout(() => { DOMMarker.classList.remove('isFriendChecked') }, 60000)
      }
    }
  }

  createMarker (id, coords) {
    const markerDOM = document.createElement('div')
    markerDOM.classList.add('marker-friend')
    markerDOM.id = `marker${id}`

    const glMarker = new mapboxgl
      .Marker(markerDOM)
      .setLngLat(coords)
      .addTo(this.map)

    this.deviceMarkers.push(glMarker)

    this.friendMarker(id, markerDOM)
  }

  friendMarker (id, marker) {
    this.friendsApi.isFriend(id)
      .then(isFriend => {
        if (isFriend) {
          marker.classList.add('isFriend')
        }
      })
  }

  modal (id, usersPosition) {
    const markerFriend = document.querySelectorAll('.marker-friend')

    if (markerFriend) {
      const modalFriend = document.getElementById('modal-friend')

      markerFriend.forEach(marker => {
        marker.addEventListener('click', () => {
          const modalFriendUsername = document.getElementById('modal-friend-name')
          const modalFriendDistance = document.getElementById('modal-friend-distance')

          modalFriendUsername.textContent = usersPosition[id][2]

          const traveledDistance = this.distanceCalculator.distance(
            this.gps.coords.latitude,
            this.gps.coords.longitude,
            usersPosition[id][0],
            usersPosition[id][1]
          )
          modalFriendDistance.textContent = `(${Math.round(traveledDistance)} km)`

          modalFriend.classList.add('active')
        })

        document.getElementById('modal-friend-close').addEventListener('click', () => {
          modalFriend.classList.remove('active')
        })

        document.getElementById('modal-add-to-friend').onclick = async () => {
          await this.friendsApi.addFriendById(id)
        }

        if (marker.classList.contains('isFriend')) {
          document.getElementById('modal-add-to-friend').style.display = 'none'
        }

        document.getElementById('modal-friend-join').addEventListener('click', () => {
          this.directions.setOrigin([this.gps.coords.longitude, this.gps.coords.latitude])
          this.directions.setDestination([usersPosition[id][1], usersPosition[id][0]])
          this.joiningFriend = id
          modalFriend.classList.remove('active')
        })
      })
    }
  }

  error (err) {
    return console.error(
      typeof err === 'string'
        ? err
        : `ERROR (${err?.code}) : ${err?.message}`
    )
  }
}

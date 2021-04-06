window.app.map = function initMap() {
  var baseLogFunction = console.error;
  console.error = function () {
    baseLogFunction.apply(console, arguments);

    var args = Array.prototype.slice.call(arguments);
    for (var i = 0; i < args.length; i++) {
      var node = createLogNode(args[i]);
      document.querySelector("#mylog").appendChild(node);
    }

  }

  function createLogNode(message) {
    var node = document.createElement("div");
    var textNode = document.createTextNode(message);
    node.innerHTML = ''
    node.appendChild(textNode);
    return node;
  }

  window.onerror = function (message, url, linenumber) {
    console.error("JavaScript error: " + message + " on line " +
      linenumber + " for " + url);
  }

  new GPSHandler().getLocation()
}

import { io } from 'socket.io-client'

class GPSHandler {
  constructor() {
    window.mapboxgl.accessToken = 'pk.eyJ1IjoibWF0aGlldWRhaXgiLCJhIjoiY2tiOWI5ODgzMGNmYTJ6cGlnOTh5bjI5ZCJ9.061wCTnhLhD99yEEmz5Osw';
    this.gps = {}
    this.map = null
    this.posBoxHistory = {}
    this.deviceMarkers = []
    this.socket = io()
    this.mapDirections = null
  }

  error(err) {
    console.error(`ERROR (${err?.code}): ${err?.message}`)
  }

  getLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(this.gpsHandler.bind(this), this.error, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      })
    } else this.error('Geolocation is not supported by this browser.')
  }


  gpsHandler(data) {
    this.gps = data
    this.createMap()
    this.socketHandler()
    this.travelWatcher()
  }

  convertSecondsToDuration(timeInSeconds) {
    let
      hrs = ~~(timeInSeconds / 3600),
      mins = ~~((timeInSeconds % 3600) / 60),
      secs = ~~timeInSeconds % 60

    let timerString = ''

    if (hrs > 0)
      timerString += `${hrs}h ${mins < 10 ? '0' : ''}`

    timerString += `${mins}min ${secs < 10 ? '0' : ''}`

    return timerString
  }

  createMap() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mathieudaix/ckkie2bdw0saz17pbidyjsgb4',
      center: [this.gps.coords.longitude, this.gps.coords.latitude],
      zoom: 10
    })

    //TODO Try to extract geoData from geolocate instead of navigator.geolocation
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    })

    this.map.addControl(geolocate)

    this.mapDirections =
      new MapboxDirections({
        accessToken: window.mapboxgl.accessToken,
        unit: 'metric',
        language: 'fr',
        interactive: false,
        alternatives: true,
        placeholderOrigin: 'Adresse de départ',
        placeholderDestination: 'Adresse d\'arrivée',
        controls: {
          instructions: false,
          profileSwitcher: false
        }
      })
        .setOrigin([this.gps.coords.longitude, this.gps.coords.latitude])
        .on('route', data => {

          // display step on route up
          const step = document.querySelector('.map')
          step.classList.add('active')

          // total distance
          const distance = document.querySelector('.map-distance')
          let distanceValue = data.route[0].distance

          if (distanceValue < '1000')
            distance.innerText = `${distanceValue.toFixed(0)} m`
          else
            distance.innerText = `${(distanceValue / 1000).toFixed(1)} km`

          // total duration
          const duration = document.querySelector('.map-duration')
          duration.innerText = this.convertSecondsToDuration(data.route[0].duration)

          // step distance
          const stepDistance = document.querySelector('.map-step-distance')
          let stepDistanceValue = data.route[0].legs[0].steps[0].distance

          if (stepDistanceValue < '1000')
            stepDistance.innerText = `${stepDistanceValue.toFixed(0)} m`
          else
            stepDistance.innerText = `${(stepDistanceValue / 1000).toFixed(1)} km`

          // instruction step
          const stepInstruction = document.querySelector('.map-step-instruction')
          stepInstruction.innerText = data.route[0].legs[0].steps[0].maneuver.instruction

        })

    this.map.addControl(this.mapDirections, 'top-left')

    const removeRouteButton = document.querySelectorAll('.geocoder-icon-close')

    removeRouteButton.forEach(removeBtn => {
      removeBtn.addEventListener('click', () => {
        removeRouteButton[0].click()
      })
    })

    document.querySelector('.mapbox-directions-destination input').addEventListener('input', this.directionsInputHandler.bind(this))

    this.map.on('load', () => geolocate.trigger())
  }

  directionsInputHandler(e) {

    const directionsOrigin = document.querySelector('.mapbox-directions-origin input')

    if (e.target.value.length === 0) {
      removeRouteButton.forEach(el => {
        el.click()
      })
    }

    if (directionsOrigin.value.length === 0) {
      directionsOrigin.value = `${this.gps.coords.longitude}, ${this.gps.coords.latitude}`
      this.mapDirections.setOrigin([this.gps.coords.longitude, this.gps.coords.latitude])
    }
  }

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

  socketHandler() {

    navigator.geolocation.watchPosition(
      () => this.socket.emit('sendPosition', [
        this.gps.coords.longitude,
        this.gps.coords.latitude
      ])
    )

    this.socket.on('receivePosition', posBox => {
      const posBoxHistoryLength = Object.keys(this.posBoxHistory).length
      const posBoxLength = Object.keys(posBox).length

      if (posBoxHistoryLength < posBoxLength) {
        const idOccurences = {}

        Object.keys(this.posBoxHistory).forEach(value => { idOccurences[value] = 1 })
        Object.keys(posBox).forEach(value => {
          idOccurences[value] = idOccurences[value] + 1 || 1
        })

        const markersToCreate = Object.entries(idOccurences).filter(([_key, value]) => value === 1).map(v => v[0])

        //TODO markers to create ne doit pas exister, il faut remplacer this.createMarker par une autre méthode qui puisse gérer deleteMarker, updateMarker, createMarker

        markersToCreate.forEach(marker => {
          this.createMarker(marker, {
            lon: posBox[marker][0],
            lat: posBox[marker][1]
          })
        })
      } else if (posBoxHistoryLength > posBoxLength) {
        const idOccurences = {}

        Object.keys(this.posBoxHistory).forEach(value => {
          idOccurences[value] = 1
        })

        Object.keys(posBox).forEach(value => {
          idOccurences[value] = idOccurences[value] + 1 || 1
        })

        const markersToDelete = Object.entries(idOccurences).filter(([_key, value]) => value === 1).map(v => v[0])

        this.deviceMarkers.forEach(device => {
          markersToDelete.forEach(id => {
            if (device._element.id === `marker${id}`) {
              device.remove()
            }
          })
        })
      }
      this.posBoxHistory = posBox
    })
  }

  travelWatcher() {
    // Seems to work only on mobile
    navigator.geolocation.watchPosition(
      () => document.getElementById('speedometer-value').textContent = parseInt(this.gps.coords.speed * 3.6)
    )

    // From London to Arlington. Returns 5918.185064088764
    new distanceCalculator().distance(51.5, 0, 38.8, -77.1)
  }
}

class distanceCalculator {
  degreesToRadians(degrees) {
    return degrees * Math.PI / 180
  }

  distance(lat1, lon1, lat2, lon2) {
    // Returns the distance in KM between Earth coordinates
    const earthRadiusKm = 6371

    const dLat = this.degreesToRadians(lat2 - lat1)
    const dLon = this.degreesToRadians(lon2 - lon1)

    lat1 = this.degreesToRadians(lat1)
    lat2 = this.degreesToRadians(lat2)

    const a = Math.sin(dLat / 2) *
      Math.sin(dLat / 2) +
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2) *
      Math.cos(lat1) *
      Math.cos(lat2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return earthRadiusKm * c
  }
}
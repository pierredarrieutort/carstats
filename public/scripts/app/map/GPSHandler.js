import DistanceCalculator from './DistanceCalculator'
import MapSocket from './MapSocket'

export default class GPSHandler {

  constructor() {
    window.mapboxgl.accessToken = 'pk.eyJ1IjoibWF0aGlldWRhaXgiLCJhIjoiY2tiOWI5ODgzMGNmYTJ6cGlnOTh5bjI5ZCJ9.061wCTnhLhD99yEEmz5Osw'

    this.gps = {}
    this.gpsOptions = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    }

    this.map = null
    this.mapDirections = null


    this.posBoxHistory = {}
    this.deviceMarkers = []

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

  gpsHandler() {
    this.travelWatcher()
    new MapSocket()
  }

  createMap() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mathieudaix/ckkie2bdw0saz17pbidyjsgb4',
      center: [this.gps.coords.longitude, this.gps.coords.latitude],
      zoom: 10
    })

    this.addGeolocateControl()
    this.addMapDirections()
    this.removeMapDirectionsInstruction()
  }

  addGeolocateControl() {
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true
    })

    this.map.addControl(geolocate)
    this.map.on('load', () => geolocate.trigger())
  }

  addMapDirections() {
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
      })
    })

    document.querySelector('.mapbox-directions-destination input').addEventListener('input', this.directionsInputHandler.bind(this))
  }

  directionsInputHandler(e) {
    const directionsOrigin = document.querySelector('.mapbox-directions-origin input')

    if (e.target.value.length === 0) removeRouteButton.forEach(el => el.click())

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
    document.getElementById('speedometer-value').textContent = parseInt(this.gps.coords?.speed * 3.6)

    new DistanceCalculator().distance(51.5, 0, 38.8, -77.1)
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

  error(err) {
    console.error(`ERROR (${err?.code}): ${err?.message}`)
  }

}
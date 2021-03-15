window.app.map = function initMap () {
  new GPSHandler().getLocation()
}

import { io } from 'socket.io-client'

class GPSHandler {
  constructor () {
    window.mapboxgl.accessToken = 'pk.eyJ1IjoibWF0aGlldWRhaXgiLCJhIjoiY2tiOWI5ODgzMGNmYTJ6cGlnOTh5bjI5ZCJ9.061wCTnhLhD99yEEmz5Osw';
    this.gps = {}
    this.map = null
    this.posBoxHistory = {}
    this.deviceMarkers = []
    this.socket = io()
  }

  error (err) {
    console.error(`ERROR (${err.code}): ${err.message}`)
  }

  getLocation () {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(this.gpsHandler.bind(this), this.error, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      })
    } else this.error('Geolocation is not supported by this browser.')
  }


  gpsHandler (data) {
    this.gps = data
    this.createMap()
    this.socketHandler()
    this.travelWatcher()
  }

  createMap () {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mathieudaix/ckkie2bdw0saz17pbidyjsgb4',
      center: [this.gps.coords.longitude, this.gps.coords.latitude],
      zoom: 3,
      // minZoom: 14,
      // maxZoom: 20
    })
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

  socketHandler () {
    this.socket.emit('sendPosition', [this.gps.coords.longitude, this.gps.coords.latitude])

    this.socket.on('sendPosition', coords => {
      const item = document.createElement('li')
      item.textContent = [this.gps.coords.longitude, this.gps.coords.latitude]
      document.getElementById('messages').append(item)
    })

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

  travelWatcher () {
    // Seems to work only on mobile
    // console.log(this.gps.coords.speed)

    // From London to Arlington. Returns 5918.185064088764
    new distanceCalculator().distance(51.5, 0, 38.8, -77.1)
  }
}

class distanceCalculator {
  degreesToRadians (degrees) {
    return degrees * Math.PI / 180
  }

  distance (lat1, lon1, lat2, lon2) {
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

window.app.map = function initMap() {
  // console.log('ici la map')
}

import { io } from 'socket.io-client'

const socket = io()

// const form = document.getElementById('form')
// const input = document.getElementById('input')

// form.addEventListener('submit', e => {
//     e.preventDefault()
//     if (input.value) {
//         socket.emit('chat message', input.value)
//         input.value = ''
//     }
// })

mapboxgl.accessToken = 'pk.eyJ1IjoibWF0aGlldWRhaXgiLCJhIjoiY2tiOWI5ODgzMGNmYTJ6cGlnOTh5bjI5ZCJ9.061wCTnhLhD99yEEmz5Osw';

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getPosition, error, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    })
  } else {
    console.log('Geolocation is not supported by this browser.')
  }

  function error(err) {
    console.warn(`ERREUR (${err.code}): ${err.message}`);
  }
}

function getPosition(position) {
  const { longitude, latitude } = position.coords
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mathieudaix/ckkie2bdw0saz17pbidyjsgb4',
    center: [longitude, latitude],
    zoom: 18,
    // minZoom: 14,
    // maxZoom: 20
  })

  socket.emit('sendPosition', [longitude, latitude])

  socket.on('sendPosition', coords => {
    var item = document.createElement('li')
    item.textContent = coords
    document.querySelector('#messages').appendChild(item)
  })

  let posBoxHistory = {}
  let deviceMarkers = []

  socket.on('receivePosition', posBox => {
    const posBoxHistoryLength = Object.keys(posBoxHistory).length
    const posBoxLength = Object.keys(posBox).length

    if (posBoxHistoryLength < posBoxLength) {
      const idOccurences = {}

      Object.keys(posBoxHistory).forEach(value => { idOccurences[value] = 1 })
      Object.keys(posBox).forEach(value => { idOccurences[value] = idOccurences[value] + 1 || 1 })

      const markersToCreate = Object.entries(idOccurences).filter(([_key, value]) => value === 1).map(v => v[0])

      markersToCreate.forEach(marker => {
        createMarker(marker, { 'lon': posBox[marker][0], 'lat': posBox[marker][1] })
      })
    } else if (posBoxHistoryLength > posBoxLength) {
      const idOccurences = {}

      Object.keys(posBoxHistory).forEach(value => { idOccurences[value] = 1 })
      Object.keys(posBox).forEach(value => { idOccurences[value] = idOccurences[value] + 1 || 1 })

      const markersToDelete = Object.entries(idOccurences).filter(([_key, value]) => value === 1).map(v => v[0])

      deviceMarkers.forEach(device => {
        markersToDelete.forEach(id => {
          if (device._element.id === `marker${id}`) {
            device.remove()
          }
        })
      })
    }

    posBoxHistory = posBox
  })

  function createMarker(id, coords) {
    let el = document.createElement('div')
    el.className = 'marker'
    el.id = 'marker' + id

    const marker = new mapboxgl
      .Marker(el)
      .setLngLat(coords)
      .addTo(map)

    deviceMarkers.push(marker)
  }

}

getLocation()
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

  socket.on('receivePosition', posBox => {
    console.log(posBox)
    for (const [key, value] of Object.entries(posBox)) {
      createMarker(key, value)
    }
  })

  function createMarker(id, coords) {

    console.log(mapboxgl)
    if (document.querySelector(`.mapboxgl-canvas-container > #id${id}`)) {
      mapboxgl.Marker(el)
        .setLngLat(coords)
    } else {
      const el = document.createElement('div')
      el.className = 'marker'
      el.id = 'id' + id

      new mapboxgl.Marker(el)
        .setLngLat(coords)
        .addTo(map)
    }

  }

}

getLocation()

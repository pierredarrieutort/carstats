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

    const longitude = position.coords.longitude
    const latitude = position.coords.latitude

    socket.emit('chat message', longitude)

    socket.on('chat message', function (msg) {
        var item = document.createElement('li')
        item.textContent = msg
        document.querySelector('#messages').appendChild(item)
    })

    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mathieudaix/ckkie2bdw0saz17pbidyjsgb4',
        center: [longitude, latitude],
        zoom: 18,
        // minZoom: 14,
        // maxZoom: 20
    })

    const geojson = {
        type: 'FeatureCollection',
        features: [
            {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [longitude, latitude]
                }
            },
            {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [13.404954, 52.520007]
                }
            },
            {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [12.404954, 52.520007]
                }
            }
        ]
    }

    geojson.features.forEach(marker => {
        const el = document.createElement('div')
        el.className = 'marker'

        new mapboxgl.Marker(el)
            .setLngLat(marker.geometry.coordinates)
            .addTo(map)
    })

}

getLocation()
mapboxgl.accessToken = 'pk.eyJ1IjoibWF0aGlldWRhaXgiLCJhIjoiY2tiOWI5ODgzMGNmYTJ6cGlnOTh5bjI5ZCJ9.061wCTnhLhD99yEEmz5Osw';

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getPosition);
    } else {
        console.log('Geolocation is not supported by this browser.')
    }
}

function getPosition(position) {

    const longitude = position.coords.longitude
    const latitude = position.coords.latitude

    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mathieudaix/ckkie2bdw0saz17pbidyjsgb4',
        center: [longitude, latitude],
        zoom: 18,
    })

    const geojson = {
        type: 'FeatureCollection',
        features: [{
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [longitude, latitude]
            },
        }]
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
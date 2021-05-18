import mapboxgl from 'mapbox-gl'

export default class PoiManager {
  constructor (map) {
    this.map = map
  }

  start () {
    this.wazeExtractor = new WazeExtractor(this.map)
    this.wazeExtractor.start()
  }
}

class WazeExtractor {
  constructor (map) {
    this.map = map
    this.isReady = true
    this.domAlerts = {}
  }

  cooldown () {
    this.isReady = false
    setTimeout(() => this.isReady = true, 30000)
  }

  start () {
    this.map.on('moveend', async () => {
      if (this.isReady) {
        this.cooldown()
        const [[left, bottom], [right, top]] = this.map.getBounds().toArray()
        const url = `https://carstats-cors-proxy.herokuapp.com/www.waze.com/row-rtserver/web/TGeoRSS?bottom=${bottom}&left=${left}&ma=200&mj=100&mu=20&right=${right}&top=${top}4&types=alerts`

        const response = await fetch(url)
        const fetchedAlerts = await response.json()

        const domAlerts = [...document.querySelectorAll('.marker[id^=alert]')]

        this.deleteOldMarkers()

        const domAlertsKeys = Object.keys(this.domAlerts)

        fetchedAlerts.alerts.forEach(({ nThumbsUp = 0, type, location, id }) => {
          const marker = {
            nThumbsUp,
            type,
            lat: location.y,
            lng: location.x,
            id
          }

          if (domAlertsKeys.includes(id)) {
            this.updateMarker(marker)
          } else {
            this.createMarker(marker)
          }
        })
      }
    })
  }

  createMarker ({ nThumbsUp, type, lat, lng, id }) {
    const markerDOM = document.createElement('div')
    markerDOM.className = 'marker'
    markerDOM.id = id
    markerDOM.dataset.type = type
    markerDOM.dataset.thumbs = nThumbsUp

    const glMarker = new mapboxgl
      .Marker(markerDOM)
      .setLngLat([lng, lat])
      .addTo(this.map)

    this.domAlerts[id] = glMarker
  }

  updateMarker ({ id, lat, lng }) {
    this.domAlerts[id].setLngLat([lng, lat])
  }

  /**
   * Check if all domAlerts are visible in map. If not, delete them.
   */
  deleteOldMarkers () {
    Object.values(this.domAlerts).forEach(marker => {
      if (!this.map.getBounds().contains(marker.getLngLat())) {
        marker.remove()
      }
    })
  }
}

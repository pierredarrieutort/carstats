import mapboxgl from 'mapbox-gl'

export default class PoiManager {
  constructor (map) {
    this.map = map
  }

  start () {
    this.alertExtractor = new AlertExtractor(this.map)
    this.alertExtractor.start()
  }
}

class AlertExtractor {
  constructor (map) {
    this.map = map
    this.isReady = true
    this.domAlerts = {}
  }

  cooldown () {
    this.isReady = false
    setTimeout(function () { this.isReady = true }.bind(this), 30000)
  }

  start () {
    this.map.on('moveend', async function () {
      if (this.isReady && this.map.getZoom() >= 14.5) {
        this.cooldown()
        const [[left, bottom], [right, top]] = this.map.getBounds().toArray()

        const response = await window.fetch('/app/map/alerts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ top, left, bottom, right })
        })
        const fetchedAlerts = await response.json()

        this.deleteOldMarkers()

        const domAlertsKeys = Object.keys(this.domAlerts)

        fetchedAlerts.alerts?.forEach(({ nThumbsUp = 0, type, location, id }) => {
          const marker = {
            nThumbsUp,
            type,
            lat: location.y,
            lng: location.x,
            id
          }

          if (!domAlertsKeys.includes(id)) {
            this.createMarker(marker)
          }
        })
      }
    }.bind(this))
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

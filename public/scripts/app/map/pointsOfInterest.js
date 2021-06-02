import mapboxgl from 'mapbox-gl'

import DistanceCalculator from './methods/DistanceCalculator.js'

import iconJam from '../../../images/icon-jam.png'
import iconRoadClosed from '../../../images/icon-road-closed.png'
import iconPolice from '../../../images/icon-police.png'
import iconHazard from '../../../images/icon-danger.png'

export default class PoiManager {
  constructor (map, gps) {
    this.map = map
    this.gps = gps
  }

  start () {
    this.alertExtractor = new AlertExtractor(this.map, this.gps)
    this.alertExtractor.start()
  }
}

class AlertExtractor {
  constructor (map, gps) {
    this.map = map
    this.gps = gps

    this.isReady = true
    this.domAlerts = {}
  }

  start () {
    this.map.on('moveend', async function () {
      if (this.isReady && this.map.getZoom() >= 14.5) {
        this.isReady = false
        const [[left, bottom], [right, top]] = this.map.getBounds().toArray()

        const response = await window.fetch('/app/map/alerts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ top, left, bottom, right })
        })
        const fetchedAlerts = await response.json()

        this.deleteOldMarkers()

        const domAlertsKeys = Object.keys(this.domAlerts)

        fetchedAlerts.alerts?.forEach(({ nThumbsUp = 0, type, location, id, street, city }) => {
          const marker = {
            nThumbsUp,
            type,
            lat: location.y,
            lng: location.x,
            id,
            street,
            city
          }

          if (!domAlertsKeys.includes(id)) {
            this.createMarker(marker)
            this.modal()
          }
        })

        setTimeout(function () { this.isReady = true }.bind(this), 30000)
      }
    }.bind(this))
  }

  modal () {
    const modalAlert = document.getElementById('modal-alert')

    this.map.on('click', () => {
      document.querySelectorAll('.marker-alert').forEach(marker => {
        marker.addEventListener('click', element => {
          const modalAlertElement = element.currentTarget.dataset
          const modalAlertIcon = document.getElementById('modal-alert-icon')
          const modalAlertType = document.getElementById('modal-alert-type')
          const modalAlertLocation = document.getElementById('modal-alert-location')
          const modalAlertDistance = document.getElementById('modal-alert-distance')

          if (modalAlertElement.type === 'JAM') modalAlertIcon.style.backgroundImage = `url("${iconJam}")`
          else if (modalAlertElement.type === 'ROAD_CLOSED') modalAlertIcon.style.backgroundImage = `url("${iconRoadClosed}")`
          else if (modalAlertElement.type === 'POLICE') modalAlertIcon.style.backgroundImage = `url("${iconPolice}")`
          else if (modalAlertElement.type === 'HAZARD') modalAlertIcon.style.backgroundImage = `url("${iconHazard}")`

          modalAlertType.textContent = modalAlertElement.type.replace('_', ' ')
          modalAlertLocation.textContent = `${modalAlertElement.street}, ${modalAlertElement.city}`

          this.distanceCalculator = new DistanceCalculator()
          const traveledDistance = this.distanceCalculator.distance(
            this.gps.coords.latitude,
            this.gps.coords.longitude,
            modalAlertElement.lat,
            modalAlertElement.lng
          )
          modalAlertDistance.textContent = `${Math.round(traveledDistance)} km`

          modalAlert.classList.add('active')
        })
      })
    })

    document.getElementById('modal-alert-close').addEventListener('click', () => {
      modalAlert.classList.remove('active')
    })
  }

  createMarker ({ nThumbsUp, type, lat, lng, id, street, city }) {
    const markerDOM = document.createElement('div')
    markerDOM.className = 'marker-alert'
    markerDOM.id = id
    markerDOM.dataset.type = type
    markerDOM.dataset.street = street
    markerDOM.dataset.city = city
    markerDOM.dataset.lat = lat
    markerDOM.dataset.lng = lng
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

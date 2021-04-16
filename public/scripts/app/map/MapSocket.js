import { io } from 'socket.io-client'

export default class MapSocket {
  constructor() {
    this.socket = io()

    this.socketHandler()
  }

  socketHandler() {
    this.onSendPosition()
    this.onReceivePosition()
  }

  onSendPosition() {
    navigator.geolocation.watchPosition(
      () => this.socket.emit('sendPosition', [
        this.gps.coords.longitude,
        this.gps.coords.latitude
      ])
    )
  }

  onReceivePosition() {
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
}
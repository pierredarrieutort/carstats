export default class DistanceCalculator {
  degreesToRadians (degrees) {
    return degrees * Math.PI / 180
  }

  /**
   * @param  {number} lat1 Start Latitude
   * @param  {number} lon1 Start Longitude
   * @param  {number} lat2 End Latitude
   * @param  {number} lon2 End Longitude
   * @returns {number} Distance in km between Earth coordinates
   */
  distance (lat1, lon1, lat2, lon2) {
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

export class BearingCalculator {
  // Converts from degrees to radians.
  toRadians (degrees) {
    return degrees * Math.PI / 180
  }

  // Converts from radians to degrees.
  toDegrees (radians) {
    return radians * 180 / Math.PI
  }

  bearing (startLat, startLng, destLat, destLng) {
    startLat = this.toRadians(startLat)
    startLng = this.toRadians(startLng)
    destLat = this.toRadians(destLat)
    destLng = this.toRadians(destLng)

    const y = Math.sin(destLng - startLng) * Math.cos(destLat)
    const x = Math.cos(startLat) * Math.sin(destLat) -
      Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng)
    let brng = Math.atan2(y, x)
    brng = this.toDegrees(brng)
    return (brng + 360) % 360
  }
}

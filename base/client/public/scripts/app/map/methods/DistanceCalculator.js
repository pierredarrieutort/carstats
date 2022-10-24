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

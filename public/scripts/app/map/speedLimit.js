export default class SpeedLimit {
  constructor() {
    this.legalSpeed = document.querySelector('.legal-speed')
    this.legalSpeedItem = document.createElement('div')
    this.coords = {
      latitude: 0,
      longitude: 0
    }
  }

  createComponent({ latitude, longitude }) {
    this.legalSpeedItem.id = 'legalSpeed'
    this.legalSpeed.append(this.legalSpeedItem)

    this.coords = { latitude, longitude }
    setInterval(this.getCurrentSpeedLimit.bind(this), 30000)
    setTimeout(() => this.legalSpeed.classList.add('active'), 32000)
  }

  updateSpeedLimit({ latitude, longitude }) {
    this.coords = { latitude, longitude }
  }

  /**
   * Call server which get Here Maps Api response
   * @returns Speed Limit as m/s
   */
  async getCurrentSpeedLimit() {
    const res = await fetch('/app/map/maxspeed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        latitude: this.coords.latitude,
        longitude: this.coords.longitude
      })
    })
    const result = await res.json()
    const { speedLimit } = result.response.route[0].leg[0].link[0]

    const formattedSpeed = Math.round(speedLimit * 3.6)

    this.legalSpeedItem.textContent = formattedSpeed
  }
}

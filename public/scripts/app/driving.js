import Cookie from '../utils/Cookie'

window.app.driving = async function initDriving() {
  const journey = new Journey()
  await journey.fetchRoutes()
  await journey.fetchGlobalStats()
  journey.debug()
  journey.displayRoutes()
}

class Journey {
  constructor() {
    this.strapiURL = 'https://carstats-backend.herokuapp.com'

    this.routes = []
    this.globalStats = []

    this.drivingStats = document.querySelector('.driving-stats')
  }

  async fetchRoutes() {
    const cookies = new Cookie()
    const jwt = cookies.get('jwt')

    const response = await fetch(`${this.strapiURL}/travels/me`, {
      method: 'GET',
      headers: new Headers({ 'Authorization': `Bearer ${jwt}` }),
      redirect: 'follow'
    })

    this.routes = await response.json()
  }

  async fetchGlobalStats() {
    const cookies = new Cookie()
    const jwt = cookies.get('jwt')

    const response = await fetch(`${this.strapiURL}/users-global-stats/me`, {
      method: 'GET',
      headers: new Headers({ 'Authorization': `Bearer ${jwt}` }),
      redirect: 'follow'
    })

    this.globalStats = await response.json()
  }

  displayRoutes() {
    if (this.routes.length === 0) {
      const noData = document.createElement('p')
      noData.innerText = 'No travels founds.'
      this.drivingStats.append(noData)
    } else {
    }
  }

  debug() {
    console.log('routes', this.routes)
    console.log('globalStats', this.globalStats)
  }
}

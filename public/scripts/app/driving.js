import Cookie from '../utils/Cookie'

window.app.driving = async function initDriving () {
  const journey = new Journey()
  await journey.fetchRoutes()
  journey.debug()
}

class Journey {
  constructor () {
    this.strapiURL = 'https://carstats-backend.herokuapp.com'
    this.strapiURL = 'https://carstats-backend.herokuapp.com'
    this.routes = []
  }

  async fetchRoutes () {
    const cookies = new Cookie()
    const jwt = cookies.get('jwt')

    const response = await fetch(`${this.strapiURL}/travels/me`, {
      method: 'GET',
      headers: new Headers({ 'Authorization': `Bearer ${jwt}` }),
      redirect: 'follow'
    })

    this.routes = await response.json()
  }

  debug () {
    console.log(this.routes)
  }
}

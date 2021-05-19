import CONFIG from '../../../config'
import Cookie from '../utils/Cookie'

import displayMessage from '../utils/Message'

export default class Api {
  /**
   * @param  {String} method
   * @param  {String} route
   * @param  {Object} body
   * @param  {Object} headersOverride
   * @param  {Object} reqAdditional
   */
  async request ({ method = 'GET', route, body, headersOverride, reqAdditional }) {
    const _headers = new Headers(Object.assign(
      { 'Content-Type': 'application/json' },
      headersOverride
    ))

    const _reqAdditional = Object.assign(
      { body: JSON.stringify(body) },
      reqAdditional
    )

    const options = Object.assign(
      {
        method: method,
        headers: _headers,
        redirect: 'follow'
      },
      _reqAdditional
    )

    const response = await fetch(CONFIG.DOMAIN_URL + route, options)
    return await response.json()
  }
}

export class AuthApi extends Api {
  constructor () {
    super()

    this.msg = document.querySelector('.msg')
  }

  async authenticate (data) {
    const { jwt } = await this.request({
      method: 'POST',
      route: '/auth/local',
      body: data
    })

    if (jwt) {
      new Cookie().set('jwt', jwt, { path: '/', days: 30 })
      window.location.href = '/app'
    } else {
      displayMessage('error', this.msg, 'Invalid email adress or password.')
    }
  }

  async register (data) {
    const response = await this.request({
      method: 'POST',
      route: '/users',
      body: data
    })

    if (!response.error) {
      displayMessage('success', this.msg, 'Your account has been created. You will be automatically redirected.')
      setTimeout(() => window.location.href = '/auth/sign-in', 3000)
    } else {
      displayMessage('error', this.msg, response.message[0].messages[0].message)
    }
  }

  async forgotPassword (data) {
    const response = await this.request({
      method: 'POST',
      route: '/auth/forgot-password',
      body: data
    })

    if (!response.error) {
      // TODO - Fix CORS problem
      // displayMessage('success', 'You will receive an email in a few minutes.')
    } else {
      displayMessage('error', this.msg, response.message[0].messages[0].message)
    }
  }

  async resetPassword (data) {
    const response = await this.request({
      method: 'POST',
      route: '/auth/reset-password',
      body: data
    })

    if (!response.error) {
      displayMessage('success', 'You will receive an email in a few minutes.')
      setTimeout(() => window.location.href = '/auth/sign-in', 3000)
    } else {
      displayMessage('error', this.msg, response.message[0].messages[0].message)
    }
  }

  disconnect () {
    new Cookie().delete('jwt')
    window.location.reload()
  }
}

export class StatsApi extends Api {
  constructor () {
    super()

    this.cookies = new Cookie()
    this.jwt = this.cookies.get('jwt')
    this.authorization = { Authorization: `Bearer ${this.jwt}` }
  }

  async renderLatestRoutes () {
    return await this.request({
      route: '/travels/me',
      headersOverride: this.authorization
    })
  }

  async renderGlobalStats () {
    return await this.request({
      route: '/users-global-stats/me',
      headersOverride: this.authorization
    })
  }

  async leaderboard () {
    return await this.request({
      route: '/users-global-stats/leaderboard',
      headersOverride: this.authorization
    })
  }
}

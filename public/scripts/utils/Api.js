import config from '../../../config'
import Cookie from './Cookie.js'

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

    const response = await fetch(config.STRAPI_URL + route, options)
    return await response.json()
  }
}

export class AuthApi extends Api {
  constructor () {
    super()
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
    }
  }

  async register (data) {
    const response = await this.request({
      method: 'POST',
      route: '/users',
      body: data
    })

    if (!response.error) {
      window.location.href = '/auth/sign-in'
    }
  }

  async forgotPassword (data) {
    await this.request({
      method: 'POST',
      route: '/auth/forgot-password',
      body: data
    })
  }

  async resetPassword (data) {
    const response = await this.request({
      method: 'POST',
      route: '/auth/reset-password',
      body: data
    })

    if (!response.error) {
      window.location.href = '/auth/sign-in'
    }
  }

  disconnect () {
    new Cookie().delete('jwt')
    window.location.reload()
  }
}

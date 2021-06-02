import CONFIG from '../../../config.js'
import Cookie from '../utils/Cookie.js'

import displayMessage from '../utils/Message.js'

export default class Api {
  /**
   * @param  {String} method
   * @param  {String} route
   * @param  {Object} body
   * @param  {Object} headersOverride
   * @param  {Object} reqAdditional
   */
  async request ({ method = 'GET', route, body, headersOverride, reqAdditional }) {
    const _headers = new window.Headers(Object.assign(
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

    const response = await window.fetch(CONFIG.DOMAIN_URL + route, options)
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
      route: '/auth/local/register',
      body: data
    })

    if (!response.error) {
      displayMessage('success', this.msg, 'Your account has been created. You will be automatically redirected.')
      setTimeout(function () { window.location.href = '/auth/sign-in' }, 3000)
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
      setTimeout(function () { window.location.href = '/auth/sign-in' }, 3000)
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

  async updateGlobalStats (userId, body) {
    return await this.request({
      method: 'PUT',
      route: `/users-global-stats/${userId}`,
      headersOverride: this.authorization,
      body
    })
  }
}

export class FriendsApi extends Api {
  constructor () {
    super()

    this.cookies = new Cookie()
    this.jwt = this.cookies.get('jwt')
    this.authorization = { Authorization: `Bearer ${this.jwt}` }
  }

  async getFriendships () {
    return await this.request({
      route: '/friendships/me',
      headersOverride: this.authorization
    })
  }

  async blockUser (friendshipID) {
    return await this.request({
      method: 'PUT',
      route: `/friendships/${friendshipID}`,
      headersOverride: this.authorization,
      body: { status: 'blocked' }
    })
  }

  async blockUserByUsername (username) {
    return await this.request({
      method: '',
      route: '',
      headersOverride: this.authorization,
      body: { username }
    })
  }

  async addFriendByUsername (username) {
    return await this.request({
      method: 'POST',
      route: '/friendships/create-via-id',
      headersOverride: this.authorization,
      body: { username }
    })
  }

  async removeFriendshipRelation (friendshipID) {
    return await this.request({
      method: 'DELETE',
      route: `/friendships/${friendshipID}`,
      headersOverride: this.authorization
    })
  }

  async acceptFriendRequest (friendshipID) {
    return await this.request({
      method: 'PUT',
      route: `/friendships/${friendshipID}`,
      headersOverride: this.authorization,
      body: { status: 'accepted' }
    })
  }
}

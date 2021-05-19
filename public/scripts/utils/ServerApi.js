import CONFIG from '../../../config.js'
import nodeFetch from 'node-fetch'

export default class ServerApi {
  /**
   * @param  {String} method
   * @param  {String} route
   * @param  {Object} body
   * @param  {Object} headersOverride
   * @param  {Object} reqAdditional
   */
  async request ({ method = 'GET', route, body, headersOverride, reqAdditional }) {
    const _headers = Object.assign({ 'Content-Type': 'application/json' }, headersOverride)

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
      reqAdditional
    )

    const response = await nodeFetch(CONFIG.DOMAIN_URL + route, options)
    return await response.json()
  }

  async whoAmI (data) {
    return await this.request({
      route: '/users/me',
      headersOverride: {
        'Authorization': `Bearer ${data.bearer}`
      }
    })
  }
}

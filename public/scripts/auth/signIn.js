import { AuthApi } from '../utils/Api.js'

window.app.signIn = function initSignIn () {
  const signIn = document.getElementById('signIn')

  signIn.addEventListener('submit', e => {
    e.preventDefault()

    const data = new FormData(signIn)
    const authApi = new AuthApi()

    authApi.authenticate({
      identifier: data.get('username'),
      password: data.get('password')
    })
  })
}

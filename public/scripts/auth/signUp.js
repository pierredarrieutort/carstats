import { AuthApi } from '../utils/Api.js'

import displayMessage from '../utils/Message.js'

export default function initSignUp () {
  const signUp = document.getElementById('signUp')

  signUp.addEventListener('submit', e => {
    e.preventDefault()

    const data = new window.FormData(signUp)
    const pass = data.get('password')
    const passConfirm = data.get('passwordConfirm')

    if (pass === passConfirm) {
      const authApi = new AuthApi()
      authApi.register({
        method: 'POST',
        email: data.get('email'),
        username: data.get('username'),
        password: data.get('password')
      })
    } else {
      displayMessage('error', document.querySelector('.msg'), 'Passwords are not identical.')
    }
  })
}

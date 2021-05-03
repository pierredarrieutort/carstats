import { AuthApi } from '../utils/Api.js'

export default function initForgotPassword () {
  const forgotPassword = document.getElementById('forgotPassword')

  forgotPassword.addEventListener('submit', e => {
    e.preventDefault()

    const data = new FormData(forgotPassword)
    const authApi = new AuthApi()
    authApi.forgotPassword({
      email: data.get('email')
    })
  })
}

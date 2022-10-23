import { AuthApi } from '../utils/Api.js'

export default function initResetPassword () {
  const resetPassword = document.getElementById('resetPassword')

  resetPassword.addEventListener('submit', e => {
    e.preventDefault()

    const data = new window.FormData(resetPassword)
    const pass = data.get('password')
    const passConfirm = data.get('passwordConfirm')
    const currentURL = new URL(window.location)
    const code = currentURL.searchParams.get('code')

    const authApi = new AuthApi()
    authApi.resetPassword({
      code: code,
      password: pass,
      passwordConfirmation: passConfirm
    })
  })
}

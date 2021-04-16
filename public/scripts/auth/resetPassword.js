import { AuthApi } from '../utils/Api.js'

window.app.resetPassword = function initresetPassword () {
  const resetPassword = document.getElementById('resetPassword')

  resetPassword.addEventListener('submit', e => {
    e.preventDefault()

    const
      data = new FormData(resetPassword),
      pass = data.get('password'),
      passConfirm = data.get('passwordConfirm'),
      currentURL = new URL(location),
      code = currentURL.searchParams.get('code')

    const authApi = new AuthApi()
    authApi.resetPassword({
      code: code,
      password: pass,
      passwordConfirmation: passConfirm
    })
  })
}

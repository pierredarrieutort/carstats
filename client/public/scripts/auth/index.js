import initForgotPassword from './forgotPassword.js'
import initResetPassword from './resetPassword.js'
import initSignIn from './signIn.js'
import initSignUp from './signUp.js'

window.auth = {
  forgotPassword: initForgotPassword,
  resetPassword: initResetPassword,
  signIn: initSignIn,
  signUp: initSignUp
}

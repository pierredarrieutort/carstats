import initForgotPassword from './forgotPassword'
import initResetPassword from './resetPassword'
import initSignIn from './signIn'
import initSignUp from './signUp'

window.auth = {
  forgotPassword: initForgotPassword,
  resetPassword: initResetPassword,
  signIn: initSignIn,
  signUp: initSignUp
}

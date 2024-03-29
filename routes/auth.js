import express from 'express'
import Cookie from '../public/scripts/utils/Cookie'
import ServerApi from '../public/scripts/utils/ServerApi'

const authRouter = express()

authRouter.use((req, res, next) => {
  const serverApi = new ServerApi()
  serverApi.whoAmI({
    bearer: new Cookie().get('jwt', req.headers.cookie)
  })
    .then(r => {
      !r.error
        ? res.redirect('/app')
        : triggerSwitch()
    })

  function triggerSwitch () {
    switch (req.url) {
      case '/sign-in':
        switch (req.method) {
          case 'GET':
            res.render('auth/sign-in')
            break
        }
        break;
      case '/sign-up':
        res.render('auth/sign-up')
        break
      case '/forgot-password':
        switch (req.method) {
          case 'GET':
            res.render('auth/forgot-password')
            break;
          case 'POST':
            break
        }
        break;
      case '/reset-password':
        res.render('auth/reset-password')
        break
      default:
        res.redirect('/')
        break
    }
  }
})

export default authRouter

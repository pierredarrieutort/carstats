import express from 'express'
import Cookie from '../public/scripts/utils/Cookie'
import ServerApi from '../public/scripts/utils/ServerApi'

const authRouter = express()

authRouter.get('/profile', (req, res, next) => {

    const JWT = new Cookie().get('jwt', req.headers.cookie)

    new ServerApi({ bearer: JWT }).whoAmI()
        .then(({ error, username }) => {
            if (!error) {
                res.render('app/profile', { username: username })
            } else {
                res.redirect('/')
            }
        })
})

export default authRouter

import express from 'express'
import Cookie from '../public/scripts/utils/Cookie'
import ServerApi from '../public/scripts/utils/ServerApi'

const appRouter = express()

appRouter.get('/map', (req, res, next) => res.render('app/map'))

appRouter.get('/statistics', (req, res, next) => res.render('app/statistics'))

appRouter.get('/profile', (req, res, next) => {
    const JWT = new Cookie().get('jwt', req.headers.cookie)

    new ServerApi({ bearer: JWT }).whoAmI()
        .then(({ error, username }) => {
            if (!error) res.render('app/profile', { username: username })
            else res.redirect('/')
        })
})

appRouter.get('/settings', (req, res, next) => res.render('app/settings'))

export default appRouter
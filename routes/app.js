import express from 'express'
import Cookie from '../public/scripts/utils/Cookie'
import ServerApi from '../public/scripts/utils/ServerApi'

const appRouter = express()

appRouter.use((req, res, next) => {
    new ServerApi({
        bearer: new Cookie().get('jwt', req.headers.cookie)
    })
        .whoAmI()
        .then(r => {
            !r.error
                ? triggerSwitch(r)
                : res.redirect('/')
        })

    function triggerSwitch(r) {
        switch (req.url) {
            case '/map':
                res.render('app/map')
                break;
            case '/statistics':
                res.render('app/statistics')
                break;
            case '/driving':
                res.render('app/driving', { username: r.username })
                break;
            case '/settings':
                res.render('app/settings')
                break;
            default:
                res.redirect('/app/map')
                break;
        }
    }
})

export default appRouter

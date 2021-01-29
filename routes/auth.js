import express from 'express'
import Cookie from '../public/scripts/utils/Cookie'
import ServerApi from '../public/scripts/utils/ServerApi'

const authRouter = express()

// authRouter.get('/sign-in', (req, res, next) => res.render('auth/sign-in'))

// authRouter.get('/sign-up', (req, res, next) => res.render('auth/sign-up'))

// authRouter.get('/forgot-password', (req, res, next) => res.render('auth/forgot-password'))

// authRouter.post('/forgot-password', (req, res, next) => console.log(req.body))

// authRouter.get('/reset-password', (req, res, next) => res.render('auth/reset-password'))


authRouter.use((req, res, next) => {
    new ServerApi({
        bearer: new Cookie().get('jwt', req.headers.cookie)
    })
        .whoAmI()
        .then(r => {
            !r.error
                ? res.redirect('/app/map')
                : triggerSwitch(r)
        })

    function triggerSwitch(r) {
        switch (req.url) {
            case '/sign-in':
                switch (req.method) {
                    case 'GET':
                        res.render('auth/sign-in')
                        break;
                
                    case 'POST':
                        
                        break;
                }
                break;
            case '/sing-up':
                res.render('auth/sign-up')
                break;
            case '/forgot-password':
                switch (req.method) {
                    case 'GET':
                        res.render('auth/forgot-password')
                        break;
                    case 'POST':
                        console.log(req.body)
                        break;
                }
                break;
            case '/reset-password':
                res.render('auth/reset-password')
                break;
            default:
                res.redirect('/')
                break;
        }
    }
})


export default authRouter

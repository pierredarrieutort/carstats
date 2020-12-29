import express from 'express'

const authRouter = express()

authRouter.get('/sign-in', (req, res, next) => res.render('auth/sign-in'))

authRouter.get('/sign-up', (req, res, next) => res.render('auth/sign-up'))

authRouter.get('/forgot-password', (req, res, next) => res.render('auth/forgot-password'))

authRouter.post('/forgot-password', (req, res, next) => console.log(req.body))

authRouter.get('/reset-password', (req, res, next) => res.render('auth/reset-password'))


export default authRouter

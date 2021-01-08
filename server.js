import express from 'express'
import path from 'path'
import sassMiddleware from 'node-sass-middleware'
import authRouter from './routes/auth'
import appRouter from './routes/app'

const app = express()

app.set('views', path.resolve('views'))
app.set('view engine', 'ejs')

app.use(sassMiddleware({
    src: path.resolve('public/styles'),
    dest: path.resolve('public/styles'),
    indentedSyntax: false,
    outputStyle: 'compressed'
}))
app.use(express.static('public'))

const port = 3000
app.listen(port, () => console.log(`Listening on http://localhost:${port}`))

app.get('/', (req, res) => res.render('index'))

app.use('/auth', authRouter)
app.use('/', appRouter)

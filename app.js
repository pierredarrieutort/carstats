import express from 'express'
import path from 'path'
import sassMiddleware from 'node-sass-middleware'
import authRouter from './routes/auth'

const app = express()

app.set('views', path.resolve('views'))
app.set('view engine', 'ejs')

app.use(sassMiddleware({
    src: path.join(__dirname, 'public/styles'),
    dest: path.join(__dirname, 'public/styles'),
    indentedSyntax: false,
    outputStyle: 'compressed'
}))
app.use(express.static('public'))

const port = 3000
app.listen(port, () => console.log(`Listening on http://localhost:${port}`))

app.get('/', (req, res) => res.render('index'))

app.post('/', (req, res) => {
    if (req.body.message === undefined || req.body.message === '') {
        res.send('pas de message')
    }
})


app.use('/auth', authRouter)

import express from 'express'
import path from 'path'
import sassMiddleware from 'sass-middleware'
import authRouter from './routes/auth'

const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: false,
    sourceMap: true
}))

app.use(express.static('public'))

const port = 3000
app.listen(port, () => console.log(`http://localhost:${port}`))


app.get('/', (req, res) => res.render('index'))

app.post('/', (req, res) => {
    if (req.body.message === undefined || req.body.message === '') {
        res.send('pas de message')
    }
})



app.use('/auth', authRouter)

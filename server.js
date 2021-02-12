import express from 'express'
import path from 'path'
import sassMiddleware from 'node-sass-middleware'
import browserSync from 'browser-sync'

import authRouter from './routes/auth'
import appRouter from './routes/app'

const app = express()

const server = require('http').createServer(app)
const options = {}
const io = require('socket.io')(server, options)

io.on('connection', socket => {
    console.log('e')
})

app.set('views', path.resolve('views'))
app.set('view engine', 'ejs')

app.use(sassMiddleware({
    src: path.resolve('public'),
    dest: path.resolve('public'),
    indentedSyntax: false,
    outputStyle: 'compressed'
}))

app.use(express.static('public'))

const port = 3000
server.listen(port, () => console.log(`Listening on http://localhost:${port}`))

browserSync({
    files: ['**/**.{ejs,js,scss}'],
    online: false,
    open: false,
    port: port + 1,
    proxy: 'localhost:' + port,
    ui: false
})

app.get('/', (req, res) => res.render('index'))

app.use('/auth', authRouter)

app.use('/app', appRouter)
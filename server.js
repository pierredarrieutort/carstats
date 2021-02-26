import express from 'express'
import path from 'path'

import authRouter from './routes/auth'
import appRouter from './routes/app'

const app = express()

app.set('views', path.resolve('views'))
app.set('view engine', 'ejs')

app.use(express.static('dist'))

app.get('/', (req, res) => res.render('index'))

app.use('/auth', authRouter)

app.use('/app', appRouter)

const server = require('http').createServer(app)
const io = require('socket.io')(server)

io.on('connection', socket => {
    socket.on('chat message', msg => {
        io.emit('chat message', msg)
    })
})

const port = 3000
server.listen(port, () => console.log(`Listening on http://localhost:${port}`))

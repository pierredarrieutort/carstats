import express from 'express'
import path from 'path'

import authRouter from './routes/auth'
import appRouter from './routes/app'

import Cookie from './public/scripts/utils/Cookie'
import ServerApi from './public/scripts/utils/ServerApi'

const app = express()

app.set('views', path.resolve('views'))
app.set('view engine', 'ejs')

app.use(express.static('dist'))

app.get('/', (req, res) => res.render('index'))

app.use('/auth', authRouter)

app.use('/app', appRouter)

const server = require('http').createServer(app)
const io = require('socket.io')(server)

const posBox = {}

io.on('connection', socket => {
  socket.on('sendPosition', coords => {
    new ServerApi({
      bearer: new Cookie().get('jwt', socket.handshake.headers.cookie)
    })
      .whoAmI()
      .then(({ id }) => {

        const isGeolocated = coords[0] + coords[1] !== 0

        let filteredPosBox = posBox

        if (isGeolocated) {
          posBox[id] = coords

          filteredPosBox = Object.assign({}, posBox)
          delete filteredPosBox[id]
        }

        io.emit('receivePosition', filteredPosBox)
      })
  })
  socket.on('disconnecting', reason => {
    new ServerApi({
      bearer: new Cookie().get('jwt', socket.handshake.headers.cookie)
    })
      .whoAmI()
      .then(({ id }) => {
        if (posBox[id]) {
          delete posBox[id]
          // io.emit('receivePosition', posBox)
        }
      })
  })
})

const port = 3000
server.listen(port, () => console.log(`Listening on http://localhost:${port}`))

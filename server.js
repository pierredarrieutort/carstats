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

const usersPosition = {}

/**
 * Triggered when user is rooted to app
 */
io.on('connection', async socket => {

  /**
   * Check if user is trusted
   */
  const serverApi = new ServerApi()
  const response = await serverApi.whoAmI({ bearer: new Cookie().get('jwt', socket.handshake.headers.cookie) })

  response.error
    ? disconnectUser(response.id, response.error)
    : responseHandling(response.id)

  function responseHandling(userId) {
    /**
     * Creates all users position object. 
     * Requester will get it except his position
     */
    socket.on('sendPosition', ([latitude, longitude]) => {
      let filteredUsersPosition = usersPosition
      usersPosition[userId] = [latitude, longitude]

      filteredUsersPosition = Object.assign({}, usersPosition)
      delete filteredUsersPosition[userId]

      if (Object.keys(filteredUsersPosition).length)
        io.emit('usersPosition', usersPosition)
    })

    socket.on('disconnecting', reason => {
      // TODO If user remove cookie, close his socket
      removeUserPosition(userId, reason)
    })
  }
})

function removeUserPosition(userId, msg) {
  // console.log(msg)
  if (usersPosition[userId]) {
    delete usersPosition[userId]
    io.emit('deleteMarker', userId)
  }
}

const port = 3000
server.listen(port, () => console.log(`Listening on http://localhost:${port}`))

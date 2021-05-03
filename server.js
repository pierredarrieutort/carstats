import express from 'express'
import path from 'path'

import authRouter from './routes/auth'
import appRouter from './routes/app'

import Cookie from './public/scripts/utils/Cookie'
import ServerApi from './public/scripts/utils/ServerApi'

import workboxBuild from 'workbox-build'

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

  function responseHandling (userId) {
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

function removeUserPosition (userId, msg) {
  // console.log(msg)
  if (usersPosition[userId]) {
    delete usersPosition[userId]
    io.emit('deleteMarker', userId)
  }
}

const port = 3000
server.listen(port, () => console.log(`Listening on http://localhost:${port}`))


workboxBuild.generateSW({
  globDirectory: 'dist',
  globPatterns: [
    '**/*.{html,json,js,css}'
  ],
  swDest: 'dist/sw.js',
  sourcemap: false,
  skipWaiting: true
})

// app.get('/', (request, response) => {
//   response.sendFile(path.resolve('index.html'));
// });

// app.get('/sw.js', (request, response) => {
//   response.sendFile(path.resolve('sw.js'));
// });

app.get('/manifest.webmanifest', (req, res) => res.json({
  name: 'Carstats',
  short_name: 'Carstats',
  theme_color: '#1b1e22',
  background_color: '#1b1e22',
  display: 'standalone',
  orientation: 'portrait',
  scope: '/',
  start_url: '/',
  description: "The new driving experience.",
  icons: [
    {
      "src": "/images/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/images/icon-256x256.png",
      "sizes": "256x256",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/images/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/images/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/images/maskable_icon_x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "/images/maskable_icon_x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "/images/maskable_icon_x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "/images/maskable_icon_x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "/images/maskable_icon_x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "/images/maskable_icon_x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "/images/maskable_icon_x48.png",
      "sizes": "48x48",
      "type": "image/png",
      "purpose": "maskable"
    }
  ]
}))

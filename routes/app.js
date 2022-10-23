import express from 'express'
import Cookie from '../public/scripts/utils/Cookie'
import ServerApi from '../public/scripts/utils/ServerApi'
import bodyParser from 'body-parser'

const appRouter = express()

appRouter.use(express.urlencoded({ extended: true }))
appRouter.use(bodyParser.json())

appRouter.use((req, res, next) => {
  const serverApi = new ServerApi()
  serverApi.whoAmI({
    bearer: new Cookie().get('jwt', req.headers.cookie)
  })
    .then(r => {
      !r.error
        ? triggerSwitch(r)
        : res.redirect('/')
    })

  async function triggerSwitch (r) {
    switch (req.url) {
      case '/map':
        res.render('app/map')
        break
      case '/map/legalSpeedLimit':
        res.json(await getLegalSpeedLimit(req.body))
        break
      case '/map/alerts':
        res.json(await getAlerts(req.body))
        break
      default:
        res.redirect('/app/map')
        break
    }
  }
})

async function getLegalSpeedLimit ({ latitude, longitude }) {
  const url = `https://route.cit.api.here.com/routing/7.2/calculateroute.json?jsonAttributes=1&waypoint0=${latitude},${longitude}&waypoint1=${latitude},${longitude}&departure=2019-01-18T10:33:00&routeattributes=sh,lg&legattributes=li&linkattributes=nl,fc&mode=fastest;car;traffic:enabled&app_code=inVc1gDCNQCFSPEaRqFg8g&app_id=LfVLSnyDc8q6HKXY6VWQ`

  const response = await fetch(url)
  const result = await response.json()

  return result
}

async function getAlerts ({ top, left, right, bottom }) {
  const url = `https://www.waze.com/row-rtserver/web/TGeoRSS?bottom=${bottom}&left=${left}&ma=200&mj=100&mu=20&right=${right}&top=${top}4&types=alerts`

  const response = await fetch(url)
  const result = await response.json()

  return result
}

export default appRouter

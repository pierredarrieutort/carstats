import dayjs from 'dayjs/esm/index.js'
import * as dayjsDuration from 'dayjs/plugin/duration.js'
import * as dayjsRelativeTime from 'dayjs/plugin/relativeTime.js'

import leaderboard1 from '../../images/leaderboard-1.png'
import leaderboard2 from '../../images/leaderboard-2.png'
import leaderboard3 from '../../images/leaderboard-3.png'

import { StatsApi } from '../utils/Api.js'

export default function initStatistics () {
  const stats = new Stats()
  stats.init()
}

class Stats {
  constructor () {
    this.statsApi = new StatsApi()
    this.leaderboards = []
    this.domLeaderboard = document.getElementById('leaderboards')
  }

  async init () {
    await this.fetchLeaderboard()
    this.displayLeaderboards()
  }

  async fetchLeaderboard () {
    this.leaderboards = await this.statsApi.leaderboard()
  }

  displayLeaderboards () {
    this.prepareLeaderboard(this.leaderboards.maxSpeedSanitized, 'vMax', 'Ranking by speed')
    this.prepareLeaderboard(this.leaderboards.maxDistanceSanitized, 'totalDistance', 'Ranking by distance')
    this.prepareLeaderboard(this.leaderboards.totalDurationSanitized, 'totalTravelDuration', 'Ranking by duration')
  }

  prepareLeaderboard (data, property, title) {
    const leaderboardItem = document.createElement('div')
    const leaderboardTitle = document.createElement('h2')

    leaderboardTitle.textContent = title

    leaderboardItem.append(leaderboardTitle)

    let positionNumber = 1

    data.forEach(leaderboard => {
      const leaderboardElement = document.createElement('div')
      const leaderboardIcon = document.createElement('span')
      const leaderboardName = document.createElement('p')
      const leaderboardValue = document.createElement('p')

      leaderboard.position = positionNumber
      positionNumber++

      if (leaderboard.position === 1) {
        leaderboardIcon.style.backgroundImage = `url("${leaderboard1}")`
      } else if (leaderboard.position === 2) {
        leaderboardIcon.style.backgroundImage = `url("${leaderboard2}")`
      } else if (leaderboard.position === 3) {
        leaderboardIcon.style.backgroundImage = `url("${leaderboard3}")`
      } else {
        leaderboardIcon.className = 'position'
        leaderboardIcon.textContent = leaderboard.position
      }

      leaderboardName.textContent = leaderboard.user_id.username

      let duration = null

      switch (property) {
        case 'vMax':
          leaderboardValue.textContent = `${Math.round(leaderboard[property] * 3.6)} km/h`
          break
        case 'totalDistance':
          leaderboardValue.textContent = `${Math.round(leaderboard[property])} km`
          break
        case 'totalTravelDuration':
          dayjs.extend(dayjsDuration)
          dayjs.extend(dayjsRelativeTime)

          duration = dayjs.duration(leaderboard[property], 'seconds').humanize()

          leaderboardValue.textContent = duration
          break
      }

      leaderboardItem.append(leaderboardElement)
      leaderboardElement.append(leaderboardIcon, leaderboardName, leaderboardValue)
    })

    this.domLeaderboard.append(leaderboardItem)
  }
}

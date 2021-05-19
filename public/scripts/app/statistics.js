import dayjs from 'dayjs/esm/index.js'
import * as dayjsDuration from 'dayjs/plugin/duration.js'
import * as dayjsRelativeTime from 'dayjs/plugin/relativeTime.js'

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
    this.prepareLeaderboard(this.leaderboards.maxSpeedSanitized, 'vMax', 'By speed')
    this.prepareLeaderboard(this.leaderboards.maxDistanceSanitized, 'totalDistance', 'By distance')
    this.prepareLeaderboard(this.leaderboards.totalDurationSanitized, 'totalTravelDuration', 'By duration')
  }

  prepareLeaderboard (data, property, title) {
    const leaderboardItem = document.createElement('div')
    const leaderboardTitle = document.createElement('h2')

    leaderboardTitle.textContent = title

    leaderboardItem.append(leaderboardTitle)

    data.forEach(leaderboard => {
      const leaderboardName = document.createElement('p')
      const leaderboardValue = document.createElement('p')

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

      leaderboardItem.append(leaderboardName, leaderboardValue)
    })

    this.domLeaderboard.append(leaderboardItem)
  }
}

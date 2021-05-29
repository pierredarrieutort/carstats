import initStatistics from './statistics.js'
import initDriving from './driving.js'
import initSettings from './settings.js'

export default class Modal {
  constructor () {
    this.modalContent = document.querySelector('.modal-content')
    this.menuItems = document.querySelectorAll('#main-menu li')

    this.focusing = 'navigation'
  }

  modal (focusing, e) {
    this.focusing = focusing
    this.menuItems.forEach(item => {
      item.classList.remove('active')
    })
    this.closeModal()
    e.currentTarget.classList.add('active')
    document.body.classList.add('activeModal')
  }

  openModal () {
    document.querySelector('.modal-navigation').addEventListener('click', e => {
      if (this.focusing !== 'navigation') {
        this.focusing = 'navigation'
        this.menuItems.forEach(item => {
          item.classList.remove('active')
        })
        this.closeModal()
        e.currentTarget.classList.add('active')
      }
    })

    document.querySelector('.modal-statistics').addEventListener('click', e => {
      if (this.focusing !== 'statistics') {
        this.modal('statistics', e)
        this.statistics()
      }
    })

    document.querySelector('.modal-driving').addEventListener('click', e => {
      if (this.focusing !== 'driving') {
        this.modal('driving', e)
        this.driving()
      }
    })

    document.querySelector('.modal-settings').addEventListener('click', e => {
      if (this.focusing !== 'settings') {
        this.modal('settings', e)
        this.settings()
      }
    })
  }

  closeModal () {
    document.body.classList.remove('activeModal')
    this.modalContent.innerHTML = ''
  }

  statistics () {
    const content = document.createElement('div')
    content.innerHTML = `
      <h1>Statistics</h1>
      <div id="leaderboards"></div>`

    this.modalContent.append(content)
    initStatistics()
  }

  driving () {
    const content = document.createElement('div')
    content.innerHTML = `
      <h1>My driving stats</h1>
      <h2>My statistics</h2>
      <div class="stats-global">
          <div>
            <p>Total kilometers</p>
            <p class="stats-kilometers">- km</p>
          </div>
          <div>
            <p>Maximum speed</p>
            <p class="stats-speed">- km/h</p>
          </div>
        </div>

        <h2>Latest travels</h2>
        <div class="driving-stats"></div>`

    this.modalContent.append(content)
    initDriving()
  }

  settings () {
    const content = document.createElement('div')
    content.innerHTML = `
      <h1>Settings</h1>
      <button id="share" class="btn">Share the app</button>
      <button id="disconnect" class="btn">Log out</button>`

    this.modalContent.append(content)
    initSettings()

    const shareData = {
      title: 'Carstats',
      text: 'The new driving experience',
      url: window.location.origin
    }

    const btn = document.getElementById('share')

    btn.addEventListener('click', async () => {
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.log('Error: ' + err)
      }
    })
  }
}

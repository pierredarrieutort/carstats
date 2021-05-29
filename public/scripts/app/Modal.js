import initStatistics from './statistics.js'
import initDriving from './driving.js'
import initSettings from './settings.js'

export default class Modal {
  constructor () {
    this.modalContent = document.querySelector('.modal-content')
    this.menuItems = document.querySelectorAll('#main-menu li')

    this.focusing = 'navigation'
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
        this.focusing = 'statistics'
        this.menuItems.forEach(item => {
          item.classList.remove('active')
        })
        this.closeModal()
        e.currentTarget.classList.add('active')
        document.body.classList.add('activeModal')
        this.statistics()
      }
    })
    document.querySelector('.modal-driving').addEventListener('click', e => {
      if (this.focusing !== 'driving') {
        this.focusing = 'driving'
        this.menuItems.forEach(item => {
          item.classList.remove('active')
        })
        this.closeModal()
        e.currentTarget.classList.add('active')
        document.body.classList.add('activeModal')
        this.driving()
      }
    })
    document.querySelector('.modal-settings').addEventListener('click', e => {
      if (this.focusing !== 'settings') {
        this.focusing = 'settings'
        this.menuItems.forEach(item => {
          item.classList.remove('active')
        })
        this.closeModal()
        e.currentTarget.classList.add('active')
        document.body.classList.add('activeModal')
        this.settings()
      }
    })
  }

  closeModal () {
    document.body.classList.remove('activeModal')
    this.modalContent.innerHTML = ''
  }

  statistics () {
    const title = document.createElement('h1')
    title.textContent = 'Statistics'

    const content = document.createElement('div')
    content.id = 'leaderboards'

    this.modalContent.append(title, content)
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
      url: window.location.host
    }

    const btn = document.getElementById('share')

    btn.addEventListener('click', async () => {
      try {
        await navigator.share(shareData)
        console.log('MDN shared successfully')
      } catch (err) {
        console.log('Error: ' + err)
      }
    })
  }
}

import Hammer from 'hammerjs'

export default class McHammer {
  constructor () {
    this.mc = new Hammer(document.getElementById('page-modal'))
  }

  start () {
    this.mc.on('panleft', this.prepareShow.bind(this))
    this.mc.on('panright', this.prepareShow.bind(this))
  }

  prepareShow (e) {
    if (e.distance > 50) {
      this.dance(e.type)
    }
  }

  dance (direction) {
    this.mc.stop(true)

    const currentPageButton = document.querySelector('#main-menu .active')
    const leftable = currentPageButton.nextElementSibling
    const rightable = currentPageButton.previousElementSibling

    console.log(direction, leftable, rightable)

    if (direction === 'panleft' && leftable) {
      leftable.click()
    } else if (direction === 'panright' && rightable) {
      rightable.click()
    }

    this.mc.stop(false)
  }
}

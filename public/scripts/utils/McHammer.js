import Hammer from 'hammerjs'

export default class McHammer {
  constructor () {
    this.mc = new Hammer(document.getElementById('page-modal'))
    this.mc.get('pan').set({ enable: true })
    this.mc.get('pinch').set({ enable: false })
    this.mc.get('press').set({ enable: false })
    this.mc.get('rotate').set({ enable: false })
    this.mc.get('swipe').set({ direction: Hammer.DIRECTION_HORIZONTAL })
    this.mc.get('tap').set({ enable: false })
  }

  start () {
    this.mc.on('panleft', this.prepareShow.bind(this))
    this.mc.on('panright', this.prepareShow.bind(this))
  }

  prepareShow (e) {
    if (e.distance > 100) {
      this.dance(e)
    }
  }

  dance (direction) {
    this.mc.stop(true)

    const currentPageButton = document.querySelector('#main-menu .active')
    const leftable = currentPageButton.nextElementSibling
    const rightable = currentPageButton.previousElementSibling

    console.log(direction, leftable, rightable)

    if (direction.type === 'panleft' && leftable) {
      leftable.click()
    } else if (direction.type === 'panright' && rightable) {
      rightable.click()
    }

    this.mc.stop(false)
  }
}

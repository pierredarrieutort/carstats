export default class Swiper {
  constructor () {
    this.xDown = 0
    this.yDown = 0

    this.currentPage = document.querySelector('#main-menu .active')
    this.pageMap = document.querySelector('#main-menu .modal-navigation')
  }

  start () {
    document.addEventListener('touchstart', this.handleTouchStart.bind(this))
    document.addEventListener('touchmove', this.handleTouchMove.bind(this))
  }

  handleTouchStart (e) {
    const [firstTouch] = e.touches || e.originalEvent.touches
    this.xDown = firstTouch.clientX
    this.yDown = firstTouch.clientY
  }

  handleTouchMove (e) {
    if (this.xDown && this.yDown) {
      const [{ clientX, clientY }] = e.touches

      const xDiff = this.xDown - clientX
      const yDiff = this.yDown - clientY

      if (Math.abs(xDiff) > Math.abs(yDiff) && !this.pageMap.classList.contains('active')) {
        xDiff > 0
          ? this.currentPage.nextElementSibling?.click()
          : this.currentPage.previousElementSibling?.click()
      }

      this.xDown = 0
      this.yDown = 0
    }
  }
}

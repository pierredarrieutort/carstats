export default function swiper () {
  document.addEventListener('touchstart', handleTouchStart, false)
  document.addEventListener('touchmove', handleTouchMove, false)

  let xDown = null
  let yDown = null

  function getTouches (e) {
    return e.touches || e.originalEvent.touches
  }

  function handleTouchStart (e) {
    const firstTouch = getTouches(e)[0]
    xDown = firstTouch.clientX
    yDown = firstTouch.clientY
  };

  function handleTouchMove (e) {
    if (!xDown || !yDown) {
      return
    }

    const xUp = e.touches[0].clientX
    const yUp = e.touches[0].clientY

    const xDiff = xDown - xUp
    const yDiff = yDown - yUp

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      const currentPageBtn = document.querySelector('#main-menu .active')

      if (!document.querySelector('#main-menu .modal-navigation').classList.contains('active')) {
        xDiff > 0
          ? currentPageBtn.nextElementSibling?.click()
          : currentPageBtn.previousElementSibling?.click()
      }
    }

    xDown = null
    yDown = null
  }
}

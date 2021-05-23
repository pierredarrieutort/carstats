export default function Swiper () {
  document.addEventListener('touchstart', handleTouchStart, false)
  document.addEventListener('touchmove', handleTouchMove, false)

  let xDown = null
  let yDown = null

  function getTouches (evt) {
    return evt.touches || evt.originalEvent.touches
  }

  function handleTouchStart (evt) {
    const firstTouch = getTouches(evt)[0]
    xDown = firstTouch.clientX
    yDown = firstTouch.clientY
  };

  function handleTouchMove (evt) {
    if (!xDown || !yDown) {
      return
    }

    const xUp = evt.touches[0].clientX
    const yUp = evt.touches[0].clientY

    const xDiff = xDown - xUp
    const yDiff = yDown - yUp

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      const currentPageButton = document.querySelector('#main-menu .active')
      const leftable = currentPageButton.nextElementSibling
      const rightable = currentPageButton.previousElementSibling

      if (!document.querySelector('#main-menu .modal-navigation').classList.contains('active')) {
        if (xDiff > 0) {
          if (leftable) {
            leftable.click()
          }
        } else {
          if (rightable) {
            rightable.click()
          }
        }
      }
    }

    xDown = null
    yDown = null
  }
}

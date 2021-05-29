window.home = {
  pwaInstaller,
  standaloneDetection
}

function standaloneDetection () {
  if (window.matchMedia('(display-mode: standalone)').matches) {
    const topRightCTA = document.querySelector('#page-home nav .container a.btn')
    topRightCTA.textContent = 'Sign up'
    topRightCTA.href = '/auth/sign-up'

    const installCTA = document.querySelector('#page-home .hero .container .hero-btn')
    installCTA.textContent = 'Sign-in and start your journey !'
    installCTA.href = '/auth/sign-in'
  }
}

function pwaInstaller () {
  // ios pwa installation instructions
  function iOS () {
    return ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(navigator.platform) || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
  }

  const btnAdd = document.querySelector('.hero-btn')

  if (iOS()) {
    if (btnAdd) {
      btnAdd.addEventListener('click', () => {
        document.querySelector('.add-app').classList.add('active')
      })
    }
  } else {
    if (btnAdd) {
      let storedInstallEvent = null // Store to keep triggerable event after a first dismiss
      window.addEventListener('beforeinstallprompt', e => {
        e.preventDefault()
        storedInstallEvent = e
        btnAdd.addEventListener('click', function () {
          storedInstallEvent.prompt()
        })
      })

      window.addEventListener('appinstalled', evt => {
        app.logEvent('a2hs', 'installed')
      })
    }
  }
}

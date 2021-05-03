import barba from '@barba/core'


export default function initbarbaEngine () {
  barba.hooks.afterEnter(({ next }) => new ScriptInjectionManagement(next))

  // barba.hooks.after(document.querySelector('[autofocus]')?.focus)

  barba.init({
    preventRunning: true,
    prevent: ({ event, href }) => {
      if (event.type === 'click' && href === location.href) {
        event.preventDefault()
        event.stopPropagation()

        if (scrollY !== 0) {
          scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
          })
        }

        return true
      }
    },
    transitions: [
      {
        once: () => { /* Keep to trigger Once's hooks */ },
        beforeLeave: () => { /* Keep to trigger beforeLeave's hooks */ },
        beforeEnter: () => { /* Keep to trigger beforeEnter's hooks */ }
      }
    ]
  })
}

addEventListener('DOMContentLoaded', initbarbaEngine)



class ScriptInjectionManagement {
  constructor (next) {
    this.nextDocument = next.container
    this.executablesDOM = next.container.querySelector('meta[name="functionsExecution"]')
    this.executables = this.executablesDOM.content
    this.namespaces = [...new Set(this.executables.split(',').map(el => el.split('.')[0]))]

    this.analyze()
  }

  analyze () {
    this.namespaces.forEach(namespace => {
      window[namespace]
        ? this.execute(namespace)
        : this.load(namespace)
    })
  }

  load (namespace) {
    const script = document.createElement('script')
    script.src = `/scripts/${namespace}/index.js`
    script.defer = true
    script.setAttribute('onload', this.prepareExecution(namespace))
    document.head.append(script)

    this.executablesDOM.remove()
  }

  prepareExecution (namespace) {
    const routes = this.executables.split(',').map(route => {
      if (route.startsWith(namespace)) {
        return `window.${route}()`
      }
    })

    return routes.toString() + ';this.removeAttribute("onload")'
  }

  execute (namespace) {
    this.executables.split(',').forEach(route => {
      const [_namespace, endpoint] = route.split('.')
      if (_namespace === namespace) {
        window[namespace][endpoint]()
      }
    })
  }
}

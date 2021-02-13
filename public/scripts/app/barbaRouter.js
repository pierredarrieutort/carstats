import barba from '@barba/core'


export default function initbarbaEngine() {
    barba.hooks.afterEnter(({ next }) => new ScriptInjectionManagement(next))

    // barba.hooks.after(document.querySelector('[autofocus]')?.focus)

    barba.init({
        preventRunning: true,
        prevent: ({ event, href }) => {
            if (event.type === 'click') {
                if (href === location.href) {
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
    constructor(next) {
        this.nextDocument = next.container
        this.loaded = []
        this.loadable = []
        this.currentExecutable = this.nextDocument.id.replace('page-', '')

        this.haveBeenAlreadyLoaded()
    }

    analyze() {
        this.loaded = [...document.head.getElementsByTagName('script')].map(({ src }) => src)
        this.loadable = [...this.nextDocument.getElementsByClassName('treatableScript')]

        this.compare()
    }

    compare() {
        this.loadable.forEach(({ src }) => {
            if (!this.loaded.includes(src))
                this.inject(src)
        })
    }

    inject(src) {
        const script = document.createElement('script')
        script.src = src
        script.setAttribute('defer', true)
        script.setAttribute('onload', `
            window.app[document.querySelector('main').id.replace('page-', '')]();
            this.removeAttribute('onload')
        `)
        document.head.append(script)
    }

    execute() {
        window.app[this.currentExecutable]()
    }

    haveBeenAlreadyLoaded() {
        window.app[this.currentExecutable]
            ? this.execute()
            : this.analyze()
    }
}

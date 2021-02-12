import barba from '@barba/core'

import { initSettings } from "./settings"
import { initProfile } from "./profile"

function jsInitialization() {
    window.app = {
        settings: initSettings,
        profile: initProfile
    }
}

export default function initbarbaEngine() {
    barba.hooks.beforeOnce(jsInitialization)

    barba.hooks.afterEnter(() => window.app[document.querySelector('main').id.replace('page-', '')]())

    barba.hooks.after(document.querySelector('[autofocus]')?.focus)

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

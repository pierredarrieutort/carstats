import barba from '@barba/core'
import { gsap } from 'gsap'

export default function initbarbaEngine() {
    barba.hooks.after(document.querySelector('[autofocus]')?.focus)

    barba.init({
        preventRunning: true,
        sync: true,
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
                enter: ({ next }) => gsap.from(next.container, { duration: .2, autoAlpha: 0, ease: 'expo.in' }),
                leave: ({ current }) => gsap.to(current.container, { duration: .2, autoAlpha: 0, ease: 'expo.out' }),
                once: () => {/* Keep to trigger Once's hooks */ }
            }
        ]
    })
}

addEventListener('DOMContentLoaded', initbarbaEngine)

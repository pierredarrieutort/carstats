import Cookie from './Cookie.js'

export default class Api {
    constructor(data) {
        this.data = data
    }

    async authenticate() {
        await fetch('https://carstatsbackend.herokuapp.com/auth/local', {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(this.data),
            redirect: 'follow'
        })
            .then(res => res.json())
            .then(({ jwt }) => {
                if (jwt) {
                    this.injectJwt(jwt)
                    location.href = '/app'
                }
            })
    }

    async register() {
        await fetch('https://carstatsbackend.herokuapp.com/users', {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(this.data),
            redirect: 'follow'
        })
            .then(res => res.json())
            .then(() => {
                if (!res.error)
                    location.href = '/auth/sign-in'
            })
    }

    async forgotPassword() {
        await fetch('https://carstatsbackend.herokuapp.com/auth/forgot-password', {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(this.data),
            redirect: 'follow'
        })
            .then(res => res.json())
    }

    async resetPassword() {
        await fetch('https://carstatsbackend.herokuapp.com/auth/reset-password', {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(this.data),
            redirect: 'follow'
        })
            .then(res => res.json())
            .then(() => {
                if (!res.error)
                    location.href = '/auth/sign-in'
            })
    }

    injectJwt(jwt) {
        new Cookie().set('jwt', jwt, { path: '/', days: 30 })
    }

    disconnect() {
        new Cookie().delete('jwt')
        location.reload()
    }
}

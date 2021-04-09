import Cookie from './Cookie.js'

export default class Api {
    constructor(data) {
        this.strapiURL = 'https://carstats-backend.herokuapp.com'
        this.data = data
    }

    async authenticate() {
        await fetch(`${this.strapiURL}/auth/local`, {
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
        await fetch(`${this.strapiURL}/users`, {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(this.data),
            redirect: 'follow'
        })
            .then(res => res.json())
            .then(res => {
                if (!res.error)
                    location.href = '/auth/sign-in'
            })
    }

    async forgotPassword() {
        await fetch(`${this.strapiURL}/auth/forgot-password`, {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(this.data),
            redirect: 'follow'
        })
            .then(res => res.json())
    }

    async resetPassword() {
        await fetch(`${this.strapiURL}/auth/reset-password`, {
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

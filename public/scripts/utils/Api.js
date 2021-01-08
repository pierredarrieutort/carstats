import Cookie from './Cookie.js'

export default class Api {
    constructor(data) {
        this.data = data
    }

    async authenticate() {
        await fetch('https://carstats.herokuapp.com/auth/local', {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(this.data),
            redirect: 'follow'
        })
            .then(res => res.json())
            .then(data => {
                this.debug(data)
                this.injectJwt(data.jwt)
            })
    }

    async register() {
        await fetch('https://carstats.herokuapp.com/users', {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(this.data),
            redirect: 'follow'
        })
            .then(res => res.json())
            .then(this.debug)
    }

    async forgotPassword() {
        await fetch('https://carstats.herokuapp.com/auth/forgot-password', {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(this.data),
            redirect: 'follow'
        })
            .then(res => res.json())
            .then(this.debug)
    }

    async resetPassword() {
        await fetch('https://carstats.herokuapp.com/auth/reset-password', {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(this.data),
            redirect: 'follow'
        })
            .then(res => res.json())
            .then(this.debug)
    }

    injectJwt(jwt) {
        new Cookie().set('jwt', jwt, { path: '/', days: 30 })
    }

    disconnect() {
        new Cookie().delete('jwt')
    }

    debug(e) {
        e.statusCode
            ? console.error(e)
            : console.info(e)
    }
}

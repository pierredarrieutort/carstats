export default class Api {
    constructor(data) {
        this.data = JSON.stringify(data)
        console.log('here')
    }

    async authenticate() {
        await fetch('https://carstats.herokuapp.com/auth/local', {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: this.data,
            redirect: 'follow'
        })
            .then(res => res.json())
            .then(this.debug)
    }

    async register() {
        await fetch('https://carstats.herokuapp.com/users', {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: this.data,
            redirect: 'follow'
        })
            .then(res => res.json())
            .then(this.debug)
    }

    async forgotPassword() {
        await fetch('https://carstats.herokuapp.com/auth/forgot-password', {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: this.data,
            redirect: 'follow'
        })
            .then(res => res.json())
            .then(this.debug)
    }

    async resetPassword() {
        await fetch('https://carstats.herokuapp.com/auth/reset-password', {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: this.data,
            redirect: 'follow'
        })
            .then(res => res.json())
            .then(this.debug)
    }

    debug(e) {
        e.statusCode
            ? console.error(e)
            : console.info(e)
    }
}

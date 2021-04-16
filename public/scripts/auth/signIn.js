import Api from '../utils/Api.js'

window.app.signIn = function initSignIn() {
    const signIn = document.getElementById('signIn')

    signIn.addEventListener('submit', e => {
        e.preventDefault()

        const
            data = new FormData(signIn),
            req = new Api({
                identifier: data.get('username'),
                password: data.get('password')
            })

        req.authenticate()
    })
}

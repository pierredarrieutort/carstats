import regeneratorRuntime from 'regenerator-runtime'
import Api from '../utils/Api.js'

export default function signInInit() {
    const signIn = document.getElementById('sign-in')

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
signInInit()

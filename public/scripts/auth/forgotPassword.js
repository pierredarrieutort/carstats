import Api from '../utils/Api.js'

window.app.forgotPassword = function initForgotPassword() {
    const forgotPassword = document.getElementById('forgotPassword')

    forgotPassword.addEventListener('submit', (e) => {
        e.preventDefault()

        const
            data = new FormData(forgotPassword),
            req = new Api({
                email: data.get('email')
            })

        req.forgotPassword()
    })
}

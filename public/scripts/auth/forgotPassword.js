import Api from '../utils/Api.js'

export default function forgotPasswordInit() {
    const forgotPassword = document.getElementById('forgot-password')

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
forgotPasswordInit()

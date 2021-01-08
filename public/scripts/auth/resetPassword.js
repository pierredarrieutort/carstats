import Api from '../utils/Api.js'

export default function resetPasswordInit() {

    const signIn = document.getElementById('reset-password')

    signIn.addEventListener('submit', e => {
        e.preventDefault()

        const
            data = new FormData(signIn),
            pass = data.get('password'),
            passConfirm = data.get('passwordConfirm'),
            currentURL = new URL(location),
            code = currentURL.searchParams.get('code')

        new Api({
            code: code,
            password: pass,
            passwordConfirmation: passConfirm
        }).resetPassword()
    })
}
resetPasswordInit()

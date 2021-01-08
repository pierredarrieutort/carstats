import Api from '../utils/Api.js'

export default function signUpInit() {
    const signUp = document.getElementById('sign-up')

    signUp.addEventListener('submit', e => {
        e.preventDefault()

        const
            data = new FormData(signUp),
            pass = data.get('password'),
            passConfirm = data.get('passwordConfirm')

        if (pass === passConfirm)
            new Api({
                method: 'PUT',
                email: data.get('email'),
                username: data.get('username'),
                password: data.get('password')
            }).register()
        else console.error('Passwords are not identical')
    })
}
signUpInit()

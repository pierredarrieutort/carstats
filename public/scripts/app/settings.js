import { AuthApi } from '../utils/Api.js'

window.app.settings = function initSettings () {
    const authApi = new AuthApi()
    document.getElementById('disconnect').onclick = authApi.disconnect
}

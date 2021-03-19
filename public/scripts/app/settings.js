import regeneratorRuntime from 'regenerator-runtime'
import Api from '../utils/Api.js'

window.app.settings = function initSettings() {
    document.getElementById('disconnect').onclick = new Api().disconnect
}

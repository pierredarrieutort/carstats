import regeneratorRuntime from 'regenerator-runtime'
import Api from '../utils/Api.js'

document.getElementById('disconnect').onclick = new Api().disconnect

import { AuthApi } from '../utils/Api.js'

export default function initSettings () {
  const authApi = new AuthApi()
  document.getElementById('disconnect').onclick = authApi.disconnect
}

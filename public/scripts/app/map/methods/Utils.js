export default class Utils {
  convertSecondsToDuration (seconds) {
    const hrs = ~~(seconds / 3600)
    const mins = ~~((seconds % 3600) / 60)

    let timerString = ''

    if (hrs > 0) timerString += `${hrs} h ${mins < 10 ? '0' : ''}`

    timerString += `${mins} min`

    return timerString
  }
}

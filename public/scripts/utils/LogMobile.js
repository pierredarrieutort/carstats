export default function LogMobile() {

  let baseLogFunction = console.error

  console.error = function () {
    baseLogFunction.apply(console, arguments)

    let args = Array.prototype.slice.call(arguments)

    for (let i = 0; i < args.length; i++) {
      let node = createLogNode(args[i])
      document.querySelector('#mylog').appendChild(node)
    }

  }

  function createLogNode(message) {
    let node = document.createElement('div')
    let textNode = document.createTextNode(message)
    node.innerHTML = ''
    node.appendChild(textNode)
    return node
  }

  window.onerror = function (message, url, linenumber) {
    console.error('JavaScript error: ' + message + ' on line ' +
      linenumber + ' for ' + url)
  }
}
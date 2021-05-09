export default function displayMessage(type, element, message) {
  element.classList.add('active')
  element.classList.add(`msg-${type}`)
  element.innerText = message
}
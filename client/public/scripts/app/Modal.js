import initStatistics from './statistics.js'
import initDriving from './driving.js'
import initSettings from './settings.js'
import { FriendsApi } from '../utils/Api.js'
import displayMessage from '../utils/Message.js'

export default class Modal {
  constructor () {
    this.modalContent = document.querySelector('.modal-content')
    this.menuItems = document.querySelectorAll('#main-menu li')

    this.focusing = 'navigation'
  }

  modal (focusing, e) {
    this.focusing = focusing
    this.menuItems.forEach(item => {
      item.classList.remove('active')
    })
    this.closeModal()
    e.currentTarget.classList.add('active')
    document.body.classList.add('activeModal')
  }

  openModal () {
    document.querySelector('.modal-navigation').addEventListener('click', e => {
      if (this.focusing !== 'navigation') {
        this.focusing = 'navigation'
        this.menuItems.forEach(item => {
          item.classList.remove('active')
        })
        this.closeModal()
        e.currentTarget.classList.add('active')
      }
    })

    document.querySelector('.modal-statistics').addEventListener('click', e => {
      if (this.focusing !== 'statistics') {
        this.modal('statistics', e)
        this.statistics()
      }
    })

    document.querySelector('.modal-driving').addEventListener('click', e => {
      if (this.focusing !== 'driving') {
        this.modal('driving', e)
        this.driving()
      }
    })

    document.querySelector('.modal-settings').addEventListener('click', e => {
      if (this.focusing !== 'settings') {
        this.modal('settings', e)
        this.settings()
      }
    })
  }

  closeModal () {
    document.body.classList.remove('activeModal')
    this.modalContent.innerHTML = ''
  }

  statistics () {
    const content = document.createElement('div')
    content.innerHTML = `
      <h1>Statistics</h1>
      <div id="leaderboards"></div>`

    this.modalContent.append(content)
    initStatistics()
  }

  driving () {
    const content = document.createElement('div')
    content.innerHTML = `
      <h1>My driving stats</h1>
      <h2>My statistics</h2>
      <div class="stats-global">
          <div>
            <p>Total kilometers</p>
            <p class="stats-kilometers">- km</p>
          </div>
          <div>
            <p>Maximum speed</p>
            <p class="stats-speed">- km/h</p>
          </div>
        </div>

        <h2>Latest travels</h2>
        <div class="driving-stats"></div>`

    this.modalContent.append(content)
    initDriving()
  }

  settings () {
    const content = document.createElement('div')
    content.innerHTML = `
      <h1>Profile</h1>
      <div class="profile-btns">
        <button id="share" class="btn">Share the app</button>
        <button id="disconnect" class="btn">Log out</button>
      </div>
      <div class="msg"></div>
      <section id="friendships"></section>
    `

    this.modalContent.append(content)
    initSettings()

    const shareData = {
      title: 'Carstats',
      text: 'The new driving experience',
      url: window.location.origin
    }

    const btn = document.getElementById('share')

    btn.addEventListener('click', async () => {
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.log('Error: ' + err)
      }
    })

    friendsInitialization()
  }
}

async function friendsInitialization () {
  const friendsApi = new FriendsApi()

  const msgItem = document.querySelector('.msg')

  const friendshipsContainer = document.getElementById('friendships')

  const myFriendsItem = document.createElement('section')
  const sendedRequestsItem = document.createElement('section')
  const pendingRequestsItem = document.createElement('section')
  const blockedUsersItem = document.createElement('section')

  /* --------------------------------------------- */

  const myFriendsTitle = document.createElement('h2')
  myFriendsTitle.textContent = 'My friends'

  const myFriendsList = document.createElement('ul')
  myFriendsList.id = 'my-friends-list'

  myFriendsItem.append(myFriendsTitle, myFriendsList)

  /* --------------------------------------------- */

  const sendedRequestsTitle = document.createElement('h2')
  sendedRequestsTitle.textContent = 'Sended requests'

  const addFriendInput = document.createElement('input')
  addFriendInput.classList.add('input-search')
  addFriendInput.name = 'username'
  addFriendInput.placeholder = 'Username'
  addFriendInput.required = true

  const addFriendButton = document.createElement('button')
  addFriendButton.classList.add('btn-blue')
  addFriendButton.textContent = 'Add a friend'
  addFriendButton.type = 'submit'

  const addFriendForm = document.createElement('form')
  addFriendForm.autocomplete = 'off'
  addFriendForm.classList.add('form-content')
  addFriendForm.append(addFriendInput, addFriendButton)
  addFriendForm.addEventListener('submit', async function (e) {
    e.preventDefault()
    const formData = new window.FormData(e.target)
    const friendReq = await friendsApi.addFriendByUsername(formData.get('username'))
    friendReq.statusCode
      ? displayMessage('error', msgItem, friendReq.message)
      : displayMessage('success', msgItem, friendReq.message)
    e.target.reset()
    refreshDomFriendships(true)
  })

  const sendedRequestsList = document.createElement('ul')
  sendedRequestsList.id = 'sended-requests-list'

  sendedRequestsItem.append(sendedRequestsTitle, addFriendForm, sendedRequestsList)

  /* --------------------------------------------- */

  const pendingRequestsTitle = document.createElement('h2')
  pendingRequestsTitle.textContent = 'Pending requests'

  const pendingRequestsList = document.createElement('ul')
  pendingRequestsList.id = 'pending-requests-list'

  pendingRequestsItem.append(pendingRequestsTitle, pendingRequestsList)

  /* --------------------------------------------- */

  const blockedUsersTitle = document.createElement('h2')
  blockedUsersTitle.textContent = 'Blocked users'

  const blockUserInput = document.createElement('input')
  blockUserInput.classList.add('input-search')
  blockUserInput.name = 'username'
  blockUserInput.placeholder = 'Username'
  blockUserInput.required = true

  const blockUserButton = document.createElement('button')
  blockUserButton.classList.add('btn-blue')
  blockUserButton.textContent = 'Block a user'
  blockUserButton.type = 'submit'

  const blockUserForm = document.createElement('form')
  blockUserForm.classList.add('form-content')
  blockUserForm.autocomplete = 'off'
  blockUserForm.append(blockUserInput, blockUserButton)
  blockUserForm.addEventListener('submit', async function (e) {
    e.preventDefault()
    const formData = new window.FormData(e.target)
    const friendReq = await friendsApi.blockUserByUsername(formData.get('username'))
    friendReq.statusCode
      ? displayMessage('error', msgItem, friendReq.message)
      : displayMessage('success', msgItem, friendReq.message)
    e.target.reset()
    refreshDomFriendships(true)
  })

  const blockedUsersList = document.createElement('ul')
  blockedUsersList.id = 'blocked-users-list'

  blockedUsersItem.append(blockedUsersTitle, blockUserForm, blockedUsersList)

  /* --------------------------------------------- */

  friendshipsContainer.append(
    myFriendsItem,
    sendedRequestsItem,
    pendingRequestsItem,
    blockedUsersItem
  )

  refreshDomFriendships()
}

async function refreshDomFriendships (refreshing = false) {
  const friendsApi = new FriendsApi()

  const myFriendsList = document.getElementById('my-friends-list')
  const sendedRequestsList = document.getElementById('sended-requests-list')
  const pendingRequestsList = document.getElementById('pending-requests-list')
  const blockedUsersList = document.getElementById('blocked-users-list')

  if (refreshing) {
    [
      myFriendsList,
      sendedRequestsList,
      pendingRequestsList,
      blockedUsersList
    ].forEach(list => { list.innerHTML = '' })
  }

  const { myFriends, sendedRequests, pendingRequests, blockedUsers } = await friendsApi.getFriendships()

  const myfriendsDomInjection = (friendshipID, from, to) => {
    const { id } = JSON.parse(window.atob(document.cookie.split('jwt=')[1].split('.')[1].replace('-', '+').replace('_', '/')))

    const verifUsername = from.id === id
      ? to.username
      : from.username

    const listItem = document.createElement('li')
    listItem.classList.add('friend-item')
    listItem.textContent = verifUsername
    listItem.dataset.frienshipId = friendshipID

    const buttonRemove = document.createElement('button')
    buttonRemove.classList.add('btn-white')
    buttonRemove.textContent = 'Remove'
    buttonRemove.addEventListener('click', async function () {
      await friendsApi.removeFriendshipRelation(this.parentElement.dataset.frienshipId)
      refreshDomFriendships(true)
    })

    const buttonBlock = document.createElement('button')
    buttonBlock.classList.add('btn-red')
    buttonBlock.textContent = 'Block'
    buttonBlock.addEventListener('click', async function () {
      await friendsApi.blockUser(this.parentElement.dataset.frienshipId)
      refreshDomFriendships(true)
    })

    listItem.append(buttonRemove, buttonBlock)

    myFriendsList.append(listItem)
  }

  myFriends.forEach(({ friendshipID, from, to }) => myfriendsDomInjection(friendshipID, from, to))

  const sendedRequestsDomInjection = (friendshipID, to) => {
    const listItem = document.createElement('li')
    listItem.classList.add('friend-item-send')
    listItem.textContent = to.username
    listItem.dataset.frienshipId = friendshipID

    const buttonCancel = document.createElement('button')
    buttonCancel.classList.add('btn-red')
    buttonCancel.textContent = 'Cancel'
    buttonCancel.addEventListener('click', async function () {
      await friendsApi.removeFriendshipRelation(this.parentElement.dataset.frienshipId)
      refreshDomFriendships(true)
    })

    listItem.append(buttonCancel)

    sendedRequestsList.append(listItem)
  }

  sendedRequests.forEach(({ friendshipID, to }) => sendedRequestsDomInjection(friendshipID, to))

  const pendingRequestsDomInjection = (friendshipID, from) => {
    const listItem = document.createElement('li')
    listItem.classList.add('friend-item-pending')
    listItem.textContent = from.username
    listItem.dataset.frienshipId = friendshipID

    const buttonAccept = document.createElement('button')
    buttonAccept.classList.add('btn-white')
    buttonAccept.textContent = 'Accept'
    buttonAccept.addEventListener('click', async function () {
      await friendsApi.acceptFriendRequest(this.parentElement.dataset.frienshipId)
      refreshDomFriendships(true)
    })

    const buttonIgnore = document.createElement('button')
    buttonIgnore.classList.add('btn-white')
    buttonIgnore.textContent = 'Ignore'
    buttonIgnore.addEventListener('click', async function () {
      await friendsApi.removeFriendshipRelation(this.parentElement.dataset.frienshipId)
      refreshDomFriendships(true)
    })

    const buttonBlock = document.createElement('button')
    buttonBlock.classList.add('btn-red')
    buttonBlock.classList.add('btn-red')
    buttonBlock.textContent = 'Block'
    buttonBlock.addEventListener('click', async function () {
      await friendsApi.blockUser(this.parentElement.dataset.frienshipId)
      refreshDomFriendships(true)
    })

    listItem.append(buttonAccept, buttonIgnore, buttonBlock)

    pendingRequestsList.append(listItem)
  }

  pendingRequests.forEach(({ friendshipID, from }) => pendingRequestsDomInjection(friendshipID, from))

  const blockedUsersDomInjection = (friendshipID, from, to) => {
    const { id } = JSON.parse(window.atob(document.cookie.split('jwt=')[1].split('.')[1].replace('-', '+').replace('_', '/')))

    const listItem = document.createElement('li')
    listItem.classList.add('friend-item-send')

    if (from.id === id) {
      listItem.textContent = to.username
    } else {
      listItem.textContent = from.username
    }

    listItem.dataset.frienshipId = friendshipID

    const buttonUnblock = document.createElement('button')
    buttonUnblock.classList.add('btn-white')
    buttonUnblock.textContent = 'Unblock'
    buttonUnblock.addEventListener('click', async function () {
      await friendsApi.removeFriendshipRelation(this.parentElement.dataset.frienshipId)
      refreshDomFriendships(true)
    })

    listItem.append(buttonUnblock)

    blockedUsersList.append(listItem)
  }

  blockedUsers.forEach(({ friendshipID, from, to }) => blockedUsersDomInjection(friendshipID, from, to))
}

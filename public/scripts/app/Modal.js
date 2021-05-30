import initStatistics from './statistics.js'
import initDriving from './driving.js'
import initSettings from './settings.js'
import { FriendsApi } from '../utils/Api.js'

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
      <h1>Settings</h1>
      <button id="share" class="btn">Share the app</button>
      <button id="disconnect" class="btn">Log out</button>
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

  const friendshipsContainer = document.getElementById('friendships')

  const myFriendsItem = document.createElement('section')
  const sendedRequestsItem = document.createElement('section')
  const pendingRequestsItem = document.createElement('section')
  const blockedUsersItem = document.createElement('section')

  /* --------------------------------------------- */

  const myFriendsTitle = document.createElement('h2')
  myFriendsTitle.textContent = 'My friends'

  const myFriendsList = document.createElement('ul')
  myFriendsList.id = 'blocked-users-list'

  myFriendsItem.append(myFriendsTitle, myFriendsList)

  /* --------------------------------------------- */

  const sendedRequestsTitle = document.createElement('h2')
  sendedRequestsTitle.textContent = 'Sended requests'

  const addFriendButton = document.createElement('button')
  addFriendButton.textContent = 'Add a friend'

  const sendedRequestsList = document.createElement('ul')
  sendedRequestsList.id = 'blocked-users-list'

  sendedRequestsItem.append(sendedRequestsTitle, addFriendButton, sendedRequestsList)

  /* --------------------------------------------- */

  const pendingRequestsTitle = document.createElement('h2')
  pendingRequestsTitle.textContent = 'Pending requests'

  const pendingRequestsList = document.createElement('ul')
  pendingRequestsList.id = 'blocked-users-list'

  pendingRequestsItem.append(pendingRequestsTitle, pendingRequestsList)

  /* --------------------------------------------- */

  const blockedUsersTitle = document.createElement('h2')
  blockedUsersTitle.textContent = 'Blocked users'

  const blockUserButton = document.createElement('button')
  blockUserButton.textContent = 'Block a user'

  const blockedUsersList = document.createElement('ul')
  blockedUsersList.id = 'blocked-users-list'

  blockedUsersItem.append(blockedUsersTitle, blockUserButton, blockedUsersList)

  /* --------------------------------------------- */

  friendshipsContainer.append(
    myFriendsItem,
    sendedRequestsItem,
    pendingRequestsItem,
    blockedUsersItem
  )

  const { myFriends, sendedRequests, pendingRequests, blockedUsers } = await friendsApi.getFriendships()

  myFriends.forEach(({ friendshipID, from, to }) => {
    const { id } = JSON.parse(window.atob(document.cookie.split('jwt=')[1].split('.')[1].replace('-', '+').replace('_', '/')))

    const verifUsername = from.id === id
      ? to.username
      : from.username

    const listItem = document.createElement('li')
    listItem.textContent = verifUsername
    listItem.dataset.frienshipId = friendshipID

    const buttonRemove = document.createElement('button')
    buttonRemove.textContent = 'Remove'
    buttonRemove.addEventListener('click', async function () {
      await friendsApi.removeFriendshipRelation(this.parentElement.dataset.frienshipId)
    })

    const buttonBlock = document.createElement('button')
    buttonBlock.textContent = 'Block'
    buttonBlock.addEventListener('click', async function () {
      await friendsApi.blockUser(this.parentElement.dataset.frienshipId)
    })

    listItem.append(buttonRemove, buttonBlock)

    myFriendsList.append(listItem)
  })

  sendedRequests.forEach(({ friendshipID, to }) => {
    const listItem = document.createElement('li')
    listItem.textContent = to.username
    listItem.dataset.frienshipId = friendshipID

    const buttonCancel = document.createElement('button')
    buttonCancel.textContent = 'Cancel'
    buttonCancel.addEventListener('click', async function () {
      await friendsApi.removeFriendshipRelation(this.parentElement.dataset.frienshipId)
    })

    listItem.append(buttonCancel)

    sendedRequestsList.append(listItem)
  })

  pendingRequests.forEach(({ friendshipID, from }) => {
    const listItem = document.createElement('li')
    listItem.textContent = from.username
    listItem.dataset.frienshipId = friendshipID

    const buttonAccept = document.createElement('button')
    buttonAccept.textContent = 'Accept'
    buttonAccept.addEventListener('click', async function () {
      await friendsApi.acceptFriendRequest(this.parentElement.dataset.frienshipId)
    })

    const buttonIgnore = document.createElement('button')
    buttonIgnore.textContent = 'Ignore'
    buttonIgnore.addEventListener('click', async function () {
      await friendsApi.removeFriendshipRelation(this.parentElement.dataset.frienshipId)
    })

    const buttonBlock = document.createElement('button')
    buttonBlock.textContent = 'Block'
    buttonBlock.addEventListener('click', async function () {
      await friendsApi.blockUser(this.parentElement.dataset.frienshipId)
    })

    listItem.append(buttonAccept, buttonIgnore, buttonBlock)

    pendingRequestsList.append(listItem)
  })

  blockedUsers.forEach(({ friendshipID, to }) => {
    const listItem = document.createElement('li')
    listItem.textContent = to.username
    listItem.dataset.frienshipId = friendshipID

    const buttonUnblock = document.createElement('button')
    buttonUnblock.textContent = 'Unblock'
    buttonUnblock.addEventListener('click', async function () {
      await friendsApi.removeFriendshipRelation(this.parentElement.dataset.frienshipId)
    })

    listItem.append(buttonUnblock)

    blockedUsersList.append(listItem)
  })
}

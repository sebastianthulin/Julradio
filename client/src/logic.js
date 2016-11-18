const request = require('superagent')
const socket = require('./services/socket')
const {receiveAccount} = require('./actions/account')
const {receiveOnlineList, receiveOnlineListChange} = require('./actions/users')
const {receiveUserNotification} = require('./actions/notifications')
const {receiveFeed, recieveFeedItem} = require('./actions/requests')
const {recieveReservations, setOnAir} = require('./actions/reservations')
const {receiveComment, receiveReply} = require('./actions/comments')
const {receiveRecent, setNowPlaying, togglePlay, setVolume} = require('./actions/player')
const localStorage = window.localStorage || {}

const logic = store => {
  socket.on('onlineList', list => store.dispatch(receiveOnlineList(list)))
  socket.on('onlineListChange', change => store.dispatch(receiveOnlineListChange(change)))

  // requests
  socket.on('feed', feed => {
    store.dispatch(receiveFeed(feed))
  })

  socket.on('feedItem', feedItem => {
    store.dispatch(recieveFeedItem(feedItem))
  })

  // reservations
  socket.on('reservations', reservations => {
    store.dispatch(recieveReservations(reservations))
    reservationsTick()
  })

  // comments
  socket.on('comment', commentData => {
    store.dispatch(receiveComment(commentData))
  })

  socket.on('reply', replyData => {
    store.dispatch(receiveReply(replyData))
  })

  socket.on('recent', recent => store.dispatch(receiveRecent(recent)))
  socket.on('playing', playing => store.dispatch(setNowPlaying(playing)))

  store.dispatch(setVolume(localStorage.volume === undefined ? 1 : Number(localStorage.volume)))
  localStorage.playing == 1 && store.dispatch(togglePlay())

  const reservationsTick = () => {
    const now = Date.now() + window.__TIMEDIFFERENCE__
    const state = store.getState().reservations
    for (let i = state.get('items').size; i--;) {
      const r = state.getIn(['items', i])
      if (now > r.get('startDate') && now < r.get('endDate')) {
        state.get('onAir') !== r && store.dispatch(setOnAir(r))
        return
      }
    }
    state.get('onAir') && store.dispatch(setOnAir(null))
  }

  setInterval(reservationsTick, 1000)

  if (window.__USER__) {
    store.dispatch(receiveAccount(window.__USER__))

    request.get('/api/notification').then(({body: notifications}) => {
      notifications.forEach(n => store.dispatch(receiveUserNotification(n)))
    })

    socket.on('notification:new', notification => {
      store.dispatch(receiveUserNotification(notification))
    })
  }
}

module.exports = logic

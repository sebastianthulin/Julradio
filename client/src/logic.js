const request = require('superagent')
const socket = require('./utils/socket')
const radio = require('./utils/radio')
const handleNotification = require('./utils/handleNotification')
const selectors = require('./selectors')
const {receiveAccount} = require('./actions/account')
const {receiveOnlineList, receiveOnlineListChange} = require('./actions/users')
const {receiveUserNotification} = require('./actions/notifications')
const {receiveFeed, recieveFeedItem} = require('./actions/requests')
const {recieveReservations, setOnAir} = require('./actions/reservations')
const {receiveComment, receiveReply} = require('./actions/comments')
const {receiveConversation, receiveMessage} = require('./actions/chat')
const {receiveAudioSource, receiveConnected, setPlaying, receiveRecent, setNowPlaying, setVolume} = require('./actions/player')
const localStorage = window.localStorage || {}

const logic = ({dispatch, getState}) => {
  socket.on('onlineList', list => dispatch(receiveOnlineList(list)))
  socket.on('onlineListChange', change => dispatch(receiveOnlineListChange(change)))

  // requests
  socket.on('feed', feed => {
    dispatch(receiveFeed(feed))
  })

  socket.on('feedItem', feedItem => {
    dispatch(recieveFeedItem(feedItem))
  })

  // reservations
  socket.on('reservations', reservations => {
    dispatch(recieveReservations(reservations))
    reservationsTick()
  })

  // comments
  socket.on('comment', commentData => {
    dispatch(receiveComment(commentData))
  })

  socket.on('reply', replyData => {
    dispatch(receiveReply(replyData))
  })

  // radio
  socket.on('recent', recent => dispatch(receiveRecent(recent)))
  socket.on('playing', playing => dispatch(setNowPlaying(playing)))

  dispatch(setVolume(localStorage.volume === undefined ? 1 : Number(localStorage.volume)))

  socket.on('audioSource', source => {
    dispatch(receiveAudioSource(source))
    dispatch(setPlaying(source && localStorage.playing == 1))
  })

  radio.onConnection(connected => dispatch(receiveConnected(connected)))


  const reservationsTick = () => {
    const now = Date.now() + window.__TIMEDIFFERENCE__
    const state = getState().reservations
    for (let i = state.get('items').size; i--;) {
      const r = state.getIn(['items', i])
      if (now > r.get('startDate') && now < r.get('endDate')) {
        state.get('onAir') !== r && dispatch(setOnAir(r))
        return
      }
    }
    state.get('onAir') && dispatch(setOnAir(null))
  }

  setInterval(reservationsTick, 1000)

  if (window.__USER__) {
    dispatch(receiveAccount(window.__USER__))

    request.get('/api/notification').then(({body: notifications}) => {
      notifications.forEach(n => dispatch(receiveUserNotification(n)))
    })

    socket.on('notification:new', notification => {
      dispatch(receiveUserNotification(notification))
    })
  }

  // chat
  socket.on('chat:conversation', conv => {
    dispatch(receiveConversation(conv))
  })

  socket.on('chat:message', message => {
    dispatch(receiveMessage(message))
  })

  handleNotification.on('message', conversationId => {
    return selectors.conversationId(getState()) === conversationId && document.hasFocus()
  })
}

module.exports = logic

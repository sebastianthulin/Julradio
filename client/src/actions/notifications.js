const request = require('superagent')
const Sound = require('../services/Sound')
const handleNotification = require('../services/handleNotification')
const errors = require('../errors')

const getMetadata = (notification, getState) => {
  const getNotificationMessage = () => {
    switch (notification.isError) {
      case true:
        return errors[notification.value] || errors.UNKNOWN_ERROR
      default:
        switch (notification.name) {
          case 'message': return 'Nytt meddelande från ' + notification.from.username
          case 'wallPost': return 'Gästbok inlägg från ' + notification.from.username
          case 'settings': return 'Profilinställningar uppdaterade'
          case 'article': return 'Artikel uppdaterad'
          case 'profilepicture': return 'Profilbild uppdaterad'
          case 'requestsong': return 'Din önskning har skickats'
          case 'resetinstructions': return 'Instruktioner har skickats till din email'
          default: return notification.name
        }
    }
  }

  const getNotificationUrl = () => {
    switch (notification.name) {
      case 'message': return '/messages/' + notification.from.username
      case 'wallPost': return '/@' + getState().account.username
    }
  }

  const getNotificationSound = () => {
    switch (notification.name) {
      case 'message': return 'bells'
    }
  }

  return {
    message: getNotificationMessage(),
    url: getNotificationUrl(),
    soundName: getNotificationSound()
  }
}

const remove = (type, value) => {
  request.post('/api/notification', {type, value}).end()
}

export const clearNotification = id => ({
  type: 'CLEAR_NOTIFICATION',
  id
})

// takes an error object returned from a superagent request
export const errorNotify = err => {
  return createNotification({
    name: '/url',  // url.split('/')[1]
    value: err.response.body.error[0],
    isError: true
  })
}

export const createNotification = notification => (dispatch, getState) => {
  // notification: {from, name, value, isError}
  const id = Math.random().toString(36).substr(2)
  const metadata = getMetadata(notification, getState)

  if (metadata.soundName) {
    Sound.play('bells')
  }

  if (window.Android && notification.from) {
    Android.notification(0, notification.type, metadata.message, location.origin + metadata.url)
  }

  dispatch({
    type: 'CREATE_NOTIFICATION',
    notification: {
      ...notification,
      id,
      metadata
    }
  })

  setTimeout(() => dispatch(clearNotification(id)), 5000)
}

export const receiveUserNotification = ({from, type: name, value}) => dispatch => {
  // value: ie. conversationId
  const isSeen = handleNotification.isSeen(name, value)
  if (isSeen) {
    remove(name, value)
  } else {
    dispatch(createNotification({from, name, value}))
    dispatch(pushUnseenCount(name, value))
  }
}

export const setNotificationHeight = (id, height) => ({
  type: 'SET_NOTIFICATION_HEIGHT',
  id,
  height
})

const pushUnseenCount = (name, value) => ({
  type: 'PUSH_UNSEEN_COUNT',
  name,
  value
})

export const pullUnseenCount = (name, value) => {
  remove(name, value) // TODO: only call when needed
  return {
    type: 'PULL_UNSEEN_COUNT',
    name,
    value
  }
}

const request = require('superagent')
const socket = require('../utils/socket')
const {errorNotify} = require('./notifications')
const selectors = require('..//selectors')

const handleErr = (dispatch, isSocket) => err => {
  dispatch(errorNotify(err, isSocket))
  return err
}

export const fetchConversations = () => (dispatch, getState) => {
  if (selectors.conversationsIsLoaded(getState())) {
    return Promise.resolve()
  }
  return request.get('/api/chat').then(({body: conversations}) => {
    dispatch(receiveConversations(conversations))
    dispatch({
      type: 'FETCH_CONVERSATIONS_SUCCESS'
    })
  }).catch(handleErr(dispatch))
}

const receiveConversations = conversations => {
  const items = conversations.map(conversation => {
    const user = conversation.users.filter(user => user._id !== window.__USER__._id)[0]
    return {user, conversation}
  })
  return {
    type: 'RECEIVE_CONVERSATIONS',
    items
  }
}

export const receiveConversation = conversation => {
  const user = conversation.users.filter(user => user._id !== window.__USER__._id)[0]
  return {
    type: 'RECEIVE_CONVERSATION',
    item: {user, conversation}
  }
}

export const selectUserConversation = username => (dispatch, getState) => {
  username = username && username.toLowerCase()

  if (!username)
    return dispatch(deselectUserConversation())

  return request.get(`/api/user/byname/${username}`).then(({body: user}) => {
    if (!user)
      return dispatch(deselectUserConversation())

    dispatch({
      type: 'SELECT_USER_CONVERSATION',
      user
    })

    const conversation = selectors.conversation(getState())

    if (conversation && !conversation.get('isLoaded')) {
      dispatch(fetchMessages(conversation.get('id')))
    }
  }).catch(handleErr(dispatch))
}

export const deselectUserConversation = () => ({
  type: 'DESELECT_USER_CONVERSATION'
})


const transformMessage = message => {
  message.date = new Date(message.date)
}

export const fetchMessages = () => (dispatch, getState) => {
  const state = getState()
  const conversationId = selectors.conversationId(state)
  const offset = selectors.conversationMessageIds(state).size

  return request.get(`/api/chat/${conversationId}/${offset}`).then(({body: messages}) => {
    messages.forEach(transformMessage)
    dispatch({
      type: 'FETCH_MESSAGES_SUCCESS',
      conversationId,
      messages
    })
  }).catch(handleErr(dispatch))
}

export const receiveMessage = message => (dispatch, getState) => {
  const conversationId = message.conversation
  const conversation = getState().chat.getIn(['conversationById', conversationId])
  if (conversation && conversation.get('isLoaded')) {
    transformMessage(message)
    dispatch({
      type: 'RECEIVE_MESSAGE',
      conversationId,
      message
    })
  }
}

export const sendMessage = text => (dispatch, getState) => {
  const userId = selectors.selectedUser(getState()).get('_id')
  socket.emit('chat:message', {text, userId}, handleErr(dispatch, true))
}

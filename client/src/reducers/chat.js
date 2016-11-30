const {fromJS} = require('immutable')

const insertMessages = (state, messages) => {
  const newIds = messages.map(m => m._id)

  const messageById = state.get('messageById').withMutations(ctx => {
    messages.forEach(message => {
      ctx.set(message._id, fromJS(message))
    })
  })

  const messageIds = state.get('messageIds').concat(newIds)
    .filter((messageId, i, self) => self.indexOf(messageId) === i)
    .sort((a, b) => messageById.getIn([a, 'date']) - messageById.getIn([b, 'date']))

  return state.merge({messageIds, messageById, isLoaded: true})
}

const conversation = (state, action) => {
  switch (action.type) {
    case 'FETCH_MESSAGES_SUCCESS':
      return insertMessages(state, action.messages)
    case 'RECEIVE_MESSAGE':
      return insertMessages(state, [action.message]).merge({
        lastMessage: fromJS(action.message),
        updatedAt: action.message.date
      })
    default:
      return state
  }
}

const initialState = fromJS({
  isLoaded: false,
  selectedUser: null, // {}
  conversationIds: [],
  conversationById: {},
  conversationIdByUsername: {}
})

const insertConversation = (ctx, item, isLoaded) => {
  const conversationId = item.conversation._id

  const conversation = fromJS({
    id: conversationId,
    isLoaded,
    user: item.user,
    lastMessage: item.conversation.lastMessage,
    updatedAt: new Date(item.conversation.updatedAt),
    messageIds: [],
    messageById: {}
  })

  ctx.setIn(['conversationById', conversationId], conversation)
  ctx.setIn(['conversationIdByUsername', item.user.usernameLower], conversationId)
}

const chat = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_CONVERSATIONS_SUCCESS':
      return state.set('isLoaded', true)
    case 'SELECT_USER_CONVERSATION':
      return state.set('selectedUser', fromJS(action.user))
    case 'DESELECT_USER_CONVERSATION':
      return state.set('selectedUser', null)
    case 'RECEIVE_CONVERSATIONS':
      return state.withMutations(ctx => {
        const conversationIds = fromJS(action.items.map(item => item.conversation._id))
        ctx.set('conversationIds', conversationIds)
        action.items.forEach(item => {
          insertConversation(ctx, item, false)
        })
      })
    case 'RECEIVE_CONVERSATION':
      return state.withMutations(ctx => {
        ctx.update('conversationIds', ids => ids.unshift(action.item.conversation._id))
        insertConversation(ctx, action.item, true)
      })
    case 'FETCH_MESSAGES_SUCCESS':
    case 'RECEIVE_MESSAGE':
      return state.updateIn(['conversationById', action.conversationId], conv => conversation(conv, action))
    default:
      return state
  }
}

module.exports = chat

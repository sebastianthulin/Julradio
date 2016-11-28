const {createSelector} = require('reselect')
const {Map} = require('immutable')
const {userRole} = require('./utils')

const emptyMap = Map()

export const unseenCount = (state, name) => state.notifications.getIn(['unseenCount', name])

// Account
export const user = state => state.account
export const userId = state => state.account._id
export const isPrivileged = state => userRole(state.account).isPrivileged()
export const isAdmin = state => userRole(state.account).isAdmin()

// Comments
export const targetComments = (state, target) => state.comments.get(target) || emptyMap

const commentIds = createSelector(targetComments, comments => comments.get('ids'))
const commentById = createSelector(targetComments, comments => comments.get('byId'))
const repliesByCommentId = createSelector(targetComments, comments => comments.get('repliesByCommentId'))
export const commentCount = createSelector(targetComments, comments => comments.get('commentCount'))
export const threadCount = createSelector(targetComments, comments => comments.get('threadCount'))

export const comments = createSelector(
  [commentIds, commentById, repliesByCommentId],
  (ids, byId, repliesByCommentId) => {
    return !ids ? null : ids.map(commentId => {
      return Map({
        comment: byId.get(commentId),
        replies: repliesByCommentId.get(commentId)
      })
    })
  }
)

// Chat
export const conversationsIsLoaded = state => state.chat.get('isLoaded')
export const selectedUser = state => state.chat.get('selectedUser')

const conversationIds = state => state.chat.get('conversationIds')
const conversationById = state => state.chat.get('conversationById')

export const conversationList = createSelector(
  [conversationIds, conversationById],
  (ids, byId) => {
    return ids.map(id => byId.get(id)).sort((a, b) => b.get('updatedAt') - a.get('updatedAt'))
  }
)

export const conversationId = state => {
  const username = state.chat.getIn(['selectedUser', 'usernameLower'])
  return state.chat.getIn(['conversationIdByUsername', username])
}

export const conversation = createSelector(
  [conversationId, conversationById],
  (id, byId) => byId.get(id)
)

export const conversationMessageIds = createSelector(conversation, conv => conv && conv.get('messageIds'))
const conversationMessageById = createSelector(conversation, conv => conv && conv.get('messageById'))

export const conversationMessages = createSelector(
  [conversationMessageIds, conversationMessageById],
  (ids, byId) => {
    return ids && ids.map(id => byId.get(id))
  }
)

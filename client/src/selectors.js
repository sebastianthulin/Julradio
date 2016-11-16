const {createSelector} = require('reselect')
const {Map} = require('immutable')
const {userRole} = require('./utils')

const emptyMap = Map()

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

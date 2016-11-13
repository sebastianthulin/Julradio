const {createSelector} = require('reselect')
const {Map} = require('immutable')

const emptyMap = Map()

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

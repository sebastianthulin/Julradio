const {Map, List, fromJS} = require('immutable')

const initialState = fromJS({
  ids: [],
  byId: {},
  repliesByCommentId: {},
  commentCount: {},
  threadCount: {}
})

const comments = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_COMMENTS_SUCCESS': {
      const byId = state.get('byId').withMutations(ctx => {
        for (let comment of action.comments) {
          ctx.set(comment._id, fromJS(comment))
        }
      })

      const ids = state.get('ids').concat(action.comments.map(c => c._id))
        .filter((id, i, self) => self.indexOf(id) === i)
        .sort((a, b) => new Date(byId.getIn([b, 'date'])) - new Date(byId.getIn([a, 'date'])))

      const repliesByCommentId = state.get('repliesByCommentId').withMutations(ctx => {
        action.replies.filter(replies => replies.length > 0).forEach(replies => {
          const _replies = fromJS(replies).sort((a, b) => new Date(a.get('date')) - new Date(b.get('date')))
          ctx.set(replies[0].replyTo, _replies)
        })
      })

      return state.merge({
        ids,
        byId,
        repliesByCommentId,
        commentCount: action.commentCount,
        threadCount: action.threadCount
      })
    }
    case 'FETCH_REPLIES_SUCCESS': {
      const replies = fromJS(action.replies).sort((a, b) => new Date(a.get('date')) - new Date(b.get('date')))
      return state.setIn(['repliesByCommentId', action.commentId], replies)
    }
    case 'DELETE_COMMENT_SUCCESS':
      if (action.replyTo) {
        return state.updateIn(['repliesByCommentId', action.replyTo], replies => {
          const i = replies.findIndex(r => r.get('_id') === action.commentId)
          return i === -1 ? replies : replies.splice(i, 1)
        })
      } else {
        return state.update('ids', ids => {
          const i = ids.indexOf(action.commentId)
          return i === -1 ? ids : ids.splice(i, 1)
        })
      }
    default:
      return state
  }
}

const byTarget = (state = Map(), action) => {
  switch (action.type) {
    case 'FETCH_COMMENTS_SUCCESS':
    case 'FETCH_REPLIES_SUCCESS':
    case 'DELETE_COMMENT_SUCCESS':
      return state.update(action.target, c => comments(c, action))
    default:
      return state
  }
}

module.exports = byTarget

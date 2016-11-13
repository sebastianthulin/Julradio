const API = require('../services/API')
const UserStore = require('../stores/UserStore')

const insertUser = comment => UserStore.insert(comment.user)

export const fetchComments = (type, target, fromTop) => (dispatch, getState) => {
  const ids = getState().comments.getIn([target, 'ids'])
  const skip = fromTop ? 0 : ids ? ids.size : 0
  API.get('/comment/' + type, {target, skip}, ({comments, replies, totalComments, totalThreads}) => {
    replies.forEach(replies => replies.forEach(insertUser))
    comments.forEach(insertUser)

    dispatch({
      type: 'FETCH_COMMENTS_SUCCESS',
      target,
      comments,
      replies,
      commentCount: totalComments,
      threadCount: totalThreads
    })
  })
}

export const fetchReplies = (target, commentId) => dispatch => {
  API.get('/comment/replies/' + commentId, replies => {
    replies.forEach(insertUser)
    dispatch({
      type: 'FETCH_REPLIES_SUCCESS',
      target,
      commentId,
      replies
    })
  })
}

export const postComment = (type, target, text) => () => {
  return new Promise(resolve => {
    API.post('/comment/' + type, {target, text}, () => {
      resolve()
    })
  })
}

export const postReply = (replyTo, text) => () => {
  return new Promise(resolve => {
    API.post('/comment/reply', {replyTo, text}, () => {
      resolve()
    })
  })
}

export const deleteComment = (target, commentId, replyTo) => dispatch => {
  API.delete('/comment/' + commentId, () => {
    dispatch({
      type: 'DELETE_COMMENT_SUCCESS',
      target,
      commentId,
      replyTo
    })
  })
}

const request = require('superagent')
const {errorNotify} = require('./notifications')

export const fetchComments = (type, target, fromTop) => (dispatch, getState) => {
  const ids = getState().comments.getIn([target, 'ids'])
  const skip = fromTop ? 0 : ids ? ids.size : 0
  request.get('/api/comment/' + type, {target, skip}).then(res => {
    const {comments, replies, totalComments, totalThreads} = res.body
    dispatch({
      type: 'FETCH_COMMENTS_SUCCESS',
      target,
      comments,
      replies,
      commentCount: totalComments,
      threadCount: totalThreads
    })
  }).catch(err => {
    dispatch(errorNotify(err))
  })
}

export const fetchReplies = (target, commentId) => dispatch => {
  request.get('/comment/replies/' + commentId).then(res => {
    const replies = res.body
    dispatch({
      type: 'FETCH_REPLIES_SUCCESS',
      target,
      commentId,
      replies
    })
  }).catch(err => {
    dispatch(errorNotify(err))
  })
}

export const postComment = (type, target, text) => dispatch => {
  return request.post('/api/comment/' + type, {target, text})
    .then(() => null)
    .catch(err => dispatch(errorNotify(err)))
}

export const postReply = (replyTo, text) => dispatch => {
  return request.post('/api/comment/reply', {replyTo, text})
    .then(() => null)
    .catch(err => dispatch(errorNotify(err)))
}

export const deleteComment = (target, commentId, replyTo) => dispatch => {
  request.delete('/api/comment/' + commentId).then(() => {
    dispatch({
      type: 'DELETE_COMMENT_SUCCESS',
      target,
      commentId,
      replyTo
    })
  }).catch(err => {
    dispatch(errorNotify(err))
  })
}

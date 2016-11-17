const socket = require('../services/socket')
const {errorNotify} = require('./notifications')

const receiveComments = (target, comments, replies) => ({
  type: 'RECEIVE_COMMENTS',
  target,
  comments,
  replies
})

export const fetchComments = (type, target, fromTop) => (dispatch, getState) => {
  const ids = getState().comments.getIn([target, 'ids'])
  const skip = fromTop ? 0 : ids ? ids.size : 0
  socket.fetch('comments:fetch', {type, target, skip}).then(body => {
    const {comments, replies, totalComments, totalThreads} = body
    dispatch({
      type: 'FETCH_COMMENTS_SUCCESS',
      target,
      commentCount: totalComments,
      threadCount: totalThreads
    })
    dispatch(receiveComments(target, comments, replies))
  }).catch(err => {
    dispatch(errorNotify(err))
  })
}

export const fetchReplies = (target, commentId) => dispatch => {
  socket.fetch('comments:fetchReplies', commentId).then(replies => {
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

export const receiveComment = ({target, comment}) => {
  return receiveComments(target, [comment], [])
}

export const receiveReply = ({target, reply}) => ({
  type: 'RECEIVE_REPLY',
  target,
  commentId: reply.replyTo,
  reply
})

export const postComment = (type, target, text) => dispatch => {
  return socket.fetch('comments:create', {text, type, target})
    .then(() => null)
    .catch(err => dispatch(errorNotify(err)))
}

export const postReply = (replyTo, text, target) => dispatch => {
  return socket.fetch('comments:createReply', {replyTo, text, target})
    .then(() => null)
    .catch(err => dispatch(errorNotify(err)))
}

export const deleteComment = (target, commentId, replyTo) => dispatch => {
  socket.fetch('comments:deleteComment', commentId).then(() => {
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

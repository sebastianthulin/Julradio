const request = require('superagent')
const {fromJS} = require('immutable')
const {createNotification, errorNotify} = require('./notifications')

const transform = request => {
  request.songRequest = !!request.granted
  request.tweet = !request.songRequest
  request.deleted = false
  return request
}

export const receiveFeed = feed => ({
  type: 'RECEIVE_FEED',
  feed: fromJS(feed.map(transform))
})

export const recieveFeedItem = feedItem => ({
  type: 'RECEIVE_FEED_ITEM',
  feedItem: fromJS(transform(feedItem))
})

export const deleteRequest = id => dispatch => {
  request.delete('/api/request/accepted/' + id).then(() => {
    dispatch({
      type: 'DELETE_REQUEST',
      id
    })
  }).catch(err => {
    dispatch(errorNotify(err))
  })
}

export const deleteTweet = id => dispatch => {
  request.delete('/api/request/tweet/' + id).then(() => {
    dispatch({
      type: 'DELETE_TWEET',
      id
    })
  }).catch(err => {
    dispatch(errorNotify(err))
  })
}

// not touching state
export const createRequest = body => dispatch => {
  return request.post('/api/request', body).then(() => {
    dispatch(createNotification({name: 'requestsong'}))
  }).catch(err => {
    dispatch(errorNotify(err))
  })
}

export const fetchRequests = () => dispatch => {
  return request.get('/api/request').then(res => res.body).catch(err => dispatch(errorNotify(err)))
}

export const acceptRequest = id => dispatch => {
  return request.put('/api/request/' + id).then(res => res.body).catch(err => dispatch(errorNotify(err)))
}

export const denyRequest = id => dispatch => {
  return request.delete('/api/request/' + id).then(res => res.body).catch(err => dispatch(errorNotify(err)))
}

export const wipeRequests = () => dispatch => {
  return request.delete('/api/request/all').then(res => res.body).catch(err => dispatch(errorNotify(err)))
}

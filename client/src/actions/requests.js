const { fromJS } = require('immutable')
const API = require('../services/API')

function transform(request) {
  request.songRequest = !!request.granted
  request.tweet = !request.songRequest
  request.deleted = false
  return request
}

export const receiveRequests = requests => ({
  type: 'RECEIVE_REQUESTS',
  requests: fromJS(requests.map(transform))
})

export const recieveRequest = request => ({
  type: 'RECEIVE_REQUEST',
  request: fromJS(transform(request))
})

export const deleteRequest = id => {
  return dispatch => {
    API.delete('/request/accepted/' + id, () => {
      dispatch({
        type: 'DELETE_REQUEST',
        id
      })
    })
  }
}

export const deleteTweet = id => {
  return dispatch => {
    API.delete('/request/tweet/' + id, () => {
      dispatch({
        type: 'DELETE_TWEET',
        id
      })
    })
  }
}
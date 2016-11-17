const request = require('superagent')
const {errorNotify} = require('./notifications')

const handleUser = user => {
  if (user.birth) {
    user.birth = new Date(user.birth)
  }
  const s = Date.now() - Date.parse(user.birth)
  const age = s / (1000 * 60 * 60 * 24 * 365)
  user.age = isNaN(age) ? false : ~~age
}

const receiveBlock = (username, block) => ({
  type: 'RECEIVE_BLOCK',
  username: username.toLowerCase(),
  block
})

const receiveUser = user => ({
  type: 'RECEIVE_USER',
  username: user.username.toLowerCase(),
  user
})

export const fetchUser = (username, query = 'profile') => dispatch => {
  username = username.toLowerCase()
  return request.get('/api/user/profile', {username, query}).then(res => {
    const {profile, block} = res.body
    profile && handleUser(profile)
    res.body.hasOwnProperty('profile') && dispatch(receiveUser(profile))
    res.body.hasOwnProperty('block') && dispatch(receiveBlock(username, block))
  }).catch(err => {
    dispatch(errorNotify(err))
  })
}

export const receiveOnlineList = onlineList => ({
  type: 'RECEIVE_ONLINE_LIST',
  onlineList
})

export const receiveOnlineListChange = ([user, connected]) => ({
  type: 'RECEIVE_ONLINE_LIST_CHANGE',
  user,
  connected
})


let searchTimeout
export const searchUsers = query => dispatch => {
  dispatch({
    type: 'SEARCH_USERS_REQUEST',
    query
  })

  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    request.get('/api/user/search?query=' + query).then(res => {
      dispatch({
        type: 'SEARCH_USERS_SUCCESS',
        users: res.body
      })
    }).catch(err => {
      dispatch(errorNotify(err))
    })
  }, 200)
}

export const fetchCrew = () => dispatch => {
  return request.get('/api/crew').then(res => {
    const crew = res.body
    crew.forEach(handleUser)
    dispatch({
      type: 'FETCH_CREW_SUCCESS',
      crew
    })
    return crew
  }).catch(err => {
    dispatch(errorNotify(err))
  })
}

// admin actions, not touching state
export const updateCrew = userIds => dispatch => {
  return request.put('/api/crew', userIds).then(() => null).catch(err => {
    dispatch(errorNotify(err))
  })
}

export const getUserByUsername = username => dispatch => {
  return request.get(`/api/user/byname/${username}`).then(res => {
    return res.body
  }).catch(err => {
    dispatch(errorNotify(err))
  })
}

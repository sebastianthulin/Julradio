const request = require('superagent')
const {errorNotify} = require('./notifications')

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

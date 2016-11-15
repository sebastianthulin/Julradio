const API = require('../services/API')

let searchTimeout

export const searchUsers = query => dispatch => {
  dispatch({
    type: 'SEARCH_USERS_REQUEST',
    query
  })

  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    API.get('/user/search?query=' + query, users => {
      dispatch({
        type: 'SEARCH_USERS_SUCCESS',
        users
      })
    })
  }, 200)
}

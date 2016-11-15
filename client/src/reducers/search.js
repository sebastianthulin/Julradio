const {fromJS} = require('immutable')

const initialState = fromJS({
  query: '',
  users: null
})

const search = (state = initialState, action) => {
  switch (action.type) {
    case 'SEARCH_USERS_REQUEST':
      return state.set('query', action.query)
    case 'SEARCH_USERS_SUCCESS':
      return state.set('users', fromJS(action.users))
    default:
      return state
  }
}

module.exports = search

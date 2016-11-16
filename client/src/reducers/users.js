const {fromJS} = require('immutable')

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

const onlineList = (state, action) => {
  switch (action.type) {
    case 'RECEIVE_ONLINE_LIST':
      return fromJS(action.onlineList)
    case 'RECEIVE_ONLINE_LIST_CHANGE': {
      if (action.connected) {
        return state.unshift(fromJS(action.user))
      }
      const i = state.findIndex(user => user.get('_id') === action.user._id)
      return state.splice(i, 1)
    }
    default:
      return state
  }
}

const initialState = fromJS({
  byUsername: {},
  blockByUsername: {},
  onlineList: [],
  search: {
    query: '',
    users: null
  },
  crew: []
})

const users = (state = initialState, action) => {
  switch (action.type) {
    case 'RECEIVE_USER':
      return state.setIn(['byUsername', action.username], fromJS(action.user))
    case 'RECEIVE_BLOCK':
      return state.setIn(['blockByUsername', action.username], fromJS(action.block))
    case 'RECEIVE_ONLINE_LIST':
    case 'RECEIVE_ONLINE_LIST_CHANGE':
      return state.update('onlineList', list => onlineList(list, action))
    case 'SEARCH_USERS_REQUEST':
    case 'SEARCH_USERS_SUCCESS':
      return state.update('search', state => search(state, action))
    case 'FETCH_CREW_SUCCESS':
      return state.set('crew', fromJS(action.crew))
    default:
      return state
  }
}

module.exports = users

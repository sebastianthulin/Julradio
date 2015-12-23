const { Map } = require('immutable')

const initialState = Map({
  sidebar: 'SIDEBAR_CLOSED'
})

function visibility(state = initialState, action) {
  switch (action.type) {
    case 'SET_VISIBILITY':
      return state.set(action.ui, action.filter)
    default:
      return state
  }
}

module.exports = visibility
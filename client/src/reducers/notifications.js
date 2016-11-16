const {fromJS} = require('immutable')

const initialState = fromJS({
  items: [],
  unseenCount: {
    message: [],
    wallPost: []
  }
})

const notifications = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_NOTIFICATION':
      return state.update('items', items => items.unshift(fromJS(action.notification)))
    case 'CLEAR_NOTIFICATION':
      return state.update('items', items => items.filter(noti => noti.get('id') !== action.id))
    case 'SET_NOTIFICATION_HEIGHT': {
      const i = state.get('items').findIndex(n => n.get('id') === action.id)
      return state.updateIn(['items', i], n => n.set('height', action.height))
    }
    case 'PUSH_UNSEEN_COUNT': {
      return state.updateIn(['unseenCount', action.name], values => {
        const i = values.indexOf(action.value)
        return i === -1 ? values.push(action.value) : values
      })
    }
    case 'PULL_UNSEEN_COUNT':
      return state.updateIn(['unseenCount', action.name], values => {
        return values.filter(value => {
          return value !== action.value
        })
      })
    default:
      return state
  }
}

module.exports = notifications

const account = (state = null, action) => {
  switch (action.type) {
    case 'RECEIVE_ACCOUNT':
      return action.account
    default:
      return state
  }
}

module.exports = account

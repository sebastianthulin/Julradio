exports.receiveOnlineList = onlineList => ({
  type: 'RECEIVE_ONLINE_LIST',
  onlineList
})

exports.receiveOnlineListChange = ([user, connected]) => ({
  type: 'RECEIVE_ONLINE_LIST_CHANGE',
  user,
  connected
})

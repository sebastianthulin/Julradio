const {fromJS} = require('immutable')

const initialState = fromJS({
  playing: false,
  connected: false,
  volume: null,
  nowPlaying: {},
  historyView: 'history',
  history: [],
  mostPlayed: []
})

const player = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_PLAYING':
      return state.set('playing', action.playing)
    case 'SET_CONNECTED':
      return state.set('connected', action.connected)
    case 'SET_VOLUME':
      return state.set('volume', action.volume)
    case 'SET_HISTORY_VIEW':
      return state.set('historyView', action.view)
    case 'SET_HISTORY':
      return state.set('history', fromJS(action.history))
    case 'SET_NOW_PLAYING': {
      const nowPlaying = fromJS(action.playing)
      return state.set('nowPlaying', nowPlaying).update('history', history => {
        const doPush = history.last() && history.last().get('title') !== nowPlaying.get('title')
        if (!doPush) {
          return history
        }
        history = history.size === 30 ? history.splice(0, 1) : history
        return history.push(nowPlaying)
      })
    }
    case 'FETCH_MOST_PLAYED':
      return state.set('mostPlayed', fromJS(action.mostPlayed))
    default:
      return state
  }
}

module.exports = player

const {fromJS} = require('immutable')

const initialState = fromJS({
  playing: false,
  connected: false,
  volume: null,
  nowPlaying: {},
  historyView: 'recent',
  recent: [],
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
    case 'SET_RECENT':
      return state.set('recent', fromJS(action.recent))
    case 'SET_NOW_PLAYING': {
      const nowPlaying = fromJS(action.playing)
      return state.set('nowPlaying', nowPlaying).update('recent', recent => {
        const doPush = recent.last() && recent.last().get('title') !== nowPlaying.get('title')
        if (!doPush) {
          return recent
        }
        recent = recent.size === 30 ? recent.splice(0, 1) : recent
        return recent.push(nowPlaying)
      })
    }
    case 'FETCH_MOST_PLAYED':
      return state.set('mostPlayed', fromJS(action.mostPlayed))
    default:
      return state
  }
}

module.exports = player

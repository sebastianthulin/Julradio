const request = require('superagent')
const radio = require('../utils/radio')
const {errorNotify} = require('./notifications')

const localStorage = window.localStorage || {}

export const receiveAudioSource = source => {
  radio.setSource(source)
  return {
    type: 'RECEIVE_PLAYABLE',
    playable: !!source
  }
}

export const receiveConnected = connected => ({
  type: 'RECEIVE_CONNECTION',
  connected
})

export const setPlaying = playing => dispatch => {
  try {
    localStorage.playing = Number(playing)
  } catch (_) {}
  dispatch({type: 'SET_PLAYING', playing})
  if (playing) {
    radio.play().catch(() => dispatch(setPlaying(false)))
  } else {
    radio.pause()
  }
}

export const togglePlay = () => (dispatch, getState) => {
  const state = getState().player
  const playing = state.get('playing')
  const playable = state.get('playable')
  if (playable) {
    dispatch(setPlaying(!playing))
  }
}

export const setVolume = volume => {
  try {
    localStorage.volume = volume
  } catch (_) {}
  radio.setVolume(volume)
  return {
    type: 'SET_VOLUME',
    volume
  }
}

export const toggleMute = () => (dispatch, getState) => {
  const volume = getState().player.get('volume')
  dispatch(setVolume(volume > 0 ? 0 : 1))
}

export const receiveRecent = recent => ({
  type: 'SET_RECENT',
  recent
})

export const setNowPlaying = playing => ({
  type: 'SET_NOW_PLAYING',
  playing
})

export const fetchMostPlayed = () => dispatch => {
  request.get('/api/songs/mostplayed').then(res => {
    dispatch({
      type: 'FETCH_MOST_PLAYED',
      mostPlayed: res.body
    })
  }).catch(err => {
    dispatch(errorNotify(err))
  })
}

export const setHistoryView = view => dispatch => {
  dispatch({
    type: 'SET_HISTORY_VIEW',
    view
  })
}
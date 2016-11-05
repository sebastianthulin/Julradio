const radio = require('../services/radio')
const localStorage = window.localStorage || {}

const setPlaying = playing => (dispatch, getState) => {
  try {
    localStorage.playing = Number(playing)
  } catch (_) {}
  dispatch({
    type: 'SET_PLAYING',
    playing
  })
  if (playing) {
    radio.play().catch(() => {
      dispatch({
        type: 'SET_PLAYING',
        playing: false
      })
    })
  } else {
    radio.pause()
  }
  radio.onceConnection(connected => {
    dispatch({
      type: 'SET_CONNECTED',
      connected
    })
  })
}

export const togglePlay = () => (dispatch, getState) => {
  const playing = getState().player.get('playing')
  dispatch(setPlaying(!playing))
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

export const setHistory = history => ({
  type: 'SET_HISTORY',
  history
})

export const setNowPlaying = playing => ({
  type: 'SET_NOW_PLAYING',
  playing
})
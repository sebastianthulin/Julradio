const { Map } = require('immutable')

const initialState = Map({
  modalName: null,
  visible: false
})

function modal(state = initialState, action) {
  switch (action.type) {
    case 'OPEN_MODAL':
      return state.merge({
        modalName: action.modalName,
        visible: true
      })
    case 'CLOSE_MODAL':
      return state.set('visible', false)
    default:
      return state
  }
}

module.exports = modal
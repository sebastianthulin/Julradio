const { EventEmitter } = require('events')
const Modal = new EventEmitter

Modal.open = function(name) {
  Modal.emit('change', name)
}

Modal.close = function() {
  Modal.emit('close')
}

module.exports = Modal
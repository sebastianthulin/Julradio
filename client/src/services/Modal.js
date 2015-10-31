const { EventEmitter } = require('events')
const Modal = new EventEmitter

Modal.open = function(name) {
  document.body.classList.add('noScroll')
  Modal.emit('change', name)
}

Modal.close = function() {
  document.body.classList.remove('noScroll')
  Modal.emit('change', null)
}

module.exports = Modal
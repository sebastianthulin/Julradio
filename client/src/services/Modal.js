var { EventEmitter } = require('events')
var Modal = new EventEmitter

Modal.open = function(name) {
  document.body.classList.add('no-scroll')
  Modal.emit('change', name)
}

Modal.close = function() {
  document.body.classList.remove('no-scroll')
  Modal.emit('change', null)
}

module.exports = Modal
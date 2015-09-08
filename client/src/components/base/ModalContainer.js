var React = require('react')
var Modal = require('../../services/Modal')

var modals = {
  LogIn: require('../modals/LogIn'),
  SignUp: require('../modals/SignUp'),
  RequestSong: require('../modals/RequestSong')
}

class ModalContainer extends React.Component {
  componentWillMount() {
    this.state = {}
    Modal.on('change', this.handleModal.bind(this))
  }

  handleModal(name) {
    var Modal = modals[name]
    this.setState({Modal})
    document.removeEventListener('click', this.boundHandleClick)
    if (Modal) {
      this.boundHandleClick = this.handleClick.bind(this)
      document.addEventListener('click', this.boundHandleClick)
    }
  }

  handleClick(ev) {
    if (React.findDOMNode(this) === ev.target) {
      Modal.close()
    }
  }

  render() {
    var { Modal } = this.state
    return !Modal ? null : (
      <div id="modal-container">
        <Modal />
      </div>
    )
  }
}

module.exports = ModalContainer
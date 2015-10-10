const React = require('react')
const Modal = require('../../services/Modal')

const modals = {
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
    const Modal = modals[name]
    this.setState({ Modal })
    document.removeEventListener('click', this.boundHandleClick)
    if (Modal) {
      this.boundHandleClick = this.handleClick.bind(this)
      document.addEventListener('click', this.boundHandleClick)
    }
  }

  handleClick(ev) {
    if (this.refs.container === ev.target) {
      Modal.close()
    }
  }

  render() {
    const { Modal } = this.state
    return !Modal ? null : (
      <div id="modal-container" ref="container">
        <Modal />
      </div>
    )
  }
}

module.exports = ModalContainer
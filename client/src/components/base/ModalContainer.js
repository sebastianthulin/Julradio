const React = require('react')
const cx = require('classnames')
const ModalService = require('../../services/Modal')

const modals = {
  LogIn: require('../modals/LogIn'),
  SignUp: require('../modals/SignUp'),
  RequestSong: require('../modals/RequestSong'),
  ForgotPassword: require('../modals/ForgotPassword')
}

class ModalContainer extends React.Component {
  componentWillMount() {
    this.state = {}
    ModalService.on('change', this.handleModal.bind(this))
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
      ModalService.close()
    }
  }

  render() {
    const { Modal } = this.state
    const visible = !!Modal
    return (
      <div ref="container" id="ModalContainer" className={cx({ visible })}>
        {Modal && <Modal />}
      </div>
    )
  }
}

module.exports = ModalContainer
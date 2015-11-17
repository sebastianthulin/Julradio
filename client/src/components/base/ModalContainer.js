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
  }

  handleClick(ev) {
    if (ev.currentTarget === ev.target) {
      ModalService.close()
    }
  }

  render() {
    const { Modal } = this.state
    const visible = !!Modal
    return (
      <div id="ModalContainer" className={cx({ visible })} onClick={this.handleClick.bind(this)}>
        {Modal && <Modal />}
      </div>
    )
  }
}

module.exports = ModalContainer
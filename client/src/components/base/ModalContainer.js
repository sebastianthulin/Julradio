const React = require('react')
const cx = require('classnames')
const ModalService = require('../../services/Modal')

const modals = {
  LogIn: require('../modals/LogIn'),
  SignUp: require('../modals/SignUp'),
  SignUpSuccess: require('../modals/SignUpSuccess'),
  RequestSong: require('../modals/RequestSong'),
  ForgotPassword: require('../modals/ForgotPassword'),
  ChangeAvatar: require('../modals/ChangeAvatar')
}

class ModalContainer extends React.Component {
  componentWillMount() {
    ModalService.on('change', this.handleModal.bind(this))
    ModalService.on('close', () => this.setState({visible: false}))
  }

  handleModal(name) {
    const Modal = modals[name]
    this.setState({
      Modal,
      visible: true
    })
  }

  handleClick(ev) {
    if (ev.currentTarget === ev.target) {
      ModalService.close()
    }
  }

  render() {
    const { Modal, visible } = this.state || {}
    return (
      <div id="ModalContainer" className={cx({ visible })} onClick={this.handleClick.bind(this)}>
        {Modal && <Modal />}
      </div>
    )
  }
}

module.exports = ModalContainer
const React = require('react')
const {connect} = require('react-redux')
const cx = require('classnames')
const {openModal, closeModal} = require('../../actions/modal')

const modals = {
  LogIn: require('../modals/LogIn'),
  SignUp: require('../modals/SignUp'),
  SignUpSuccess: require('../modals/SignUpSuccess'),
  RequestSong: require('../modals/RequestSong'),
  ForgotPassword: require('../modals/ForgotPassword'),
  ChangeAvatar: require('../modals/ChangeAvatar')
}

@connect(state => ({
  Modal: modals[state.modal.get('modalName')],
  visible: state.modal.get('visible')
}), {
  openModal,
  closeModal
})
class ModalContainer extends React.Component {
  handleClick(ev) {
    if (ev.currentTarget === ev.target) {
      this.props.closeModal()
    }
  }

  render() {
    const {Modal, visible, openModal, closeModal} = this.props
    return (
      <div id="ModalContainer" className={cx({visible})} onClick={this.handleClick.bind(this)}>
        {Modal && <Modal openModal={openModal} closeModal={closeModal} />}
      </div>
    )
  }
}

module.exports = ModalContainer

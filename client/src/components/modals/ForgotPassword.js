const React = require('react')
const {connect} = require('react-redux')
const Modal = require('./Modal')
const {forgotPassword} = require('../../actions/account')
const {createNotification} = require('../../actions/notifications')

@connect(null, {
  onForgotPassword: forgotPassword,
  onCreateNotification: createNotification
})
class ForgotPassword extends React.Component {
  handleForgot(evt) {
    evt.preventDefault()
    this.props.onForgotPassword(this.refs.email.value).then(err => {
      this.setState({disabled: false})
      if (!err) {
        this.props.closeModal()
        this.props.onCreateNotification({name: 'resetinstructions'})
      }
    })
    this.setState({disabled: true})
  }

  render() {
    const {disabled} = this.state || {}
    return (
      <Modal className="ForgotPassword">
        <header>
          Glömt lösenord
        </header>
        <main>
          <form onSubmit={this.handleForgot.bind(this)}>
            <label>Email</label>
            <input type="text" ref="email" className="clean" />
            <div className="submit">
              <button disabled={disabled}>Begär nytt lösenord</button>
            </div>
          </form>
        </main>
      </Modal>
    )
  }
}

module.exports = ForgotPassword

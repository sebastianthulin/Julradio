const React = require('react')
const {connect} = require('react-redux')
const User = require('../../services/User')
const Modal = require('./Modal')
const {createNotification} = require('../../actions/notifications')

@connect(null, {
  onCreateNotification: createNotification
})
class ForgotPassword extends React.Component {
  handleForgot(ev) {
    ev.preventDefault()
    console.log('...............')
    User.forgotPassword({
      email: this.refs.email.value
    }, err => {
      if (err) {
        this.setState({disabled: false})
      } else {
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

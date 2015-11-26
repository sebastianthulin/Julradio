const React = require('react')
const NotificationStore = require('../../stores/NotificationStore')
const ModalService = require('../../services/Modal')
const User = require('../../services/User')
const Modal = require('./Modal')

class ForgotPassword extends React.Component {
  handleForgot(ev) {
    ev.preventDefault()
    User.forgotPassword({
      email: this.refs.email.value
    }, () => {
      ModalService.close()
      NotificationStore.insert({type: 'resetinstructions'})
    })
  }

  render() {
    return (
      <Modal className="ForgotPassword">
        <header>
          Glömt lösenord
        </header>
        <main>
          <form onSubmit={this.handleForgot.bind(this)}>
            <label>Email</label>
            <input type="text" ref="email" />
            <div className="submit">
              <button>Begär nytt lösenord</button>
            </div>
          </form>
        </main>
      </Modal>
    )
  }
}

module.exports = ForgotPassword
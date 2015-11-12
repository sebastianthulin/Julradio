const React = require('react')
const ModalService = require('../../services/Modal')
const User = require('../../services/User')
const Modal = require('./Modal')

class ForgotPassword extends React.Component {
  handleForgot(ev) {
    ev.preventDefault()
    User.forgotPassword({
      email: this.refs.email.value
    }).then(() => {
      ModalService.close()
      alert('Instruktioner har nu skickats till din email')
    }).catch(function(err) {
      alert(err)
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
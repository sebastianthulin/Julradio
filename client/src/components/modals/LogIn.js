const React = require('react')
const { Link } = require('react-router')
const ModalService = require('../../services/Modal')
const User = require('../../services/User')
const Modal = require('./Modal')

class LogIn extends React.Component {
  handleSubmit(ev) {
    ev.preventDefault()
    User.logIn({
      username: this.refs.username.value,
      password: this.refs.password.value
    }, this.handleError.bind(this))
  }

  handleError(err) {
    alert(err)
  }

  render() {
    return (
      <Modal className="LogIn">
        <header>
          Logga in
        </header>
        <main>
          <form onSubmit={this.handleSubmit.bind(this)}>
            <label>Användarnamn</label>
            <input type="text" ref="username" />
            <label>Password</label>
            <input type="password" ref="password" />
            <div
              className="misq"
              onClick={ModalService.open.bind(null, 'ForgotPassword')}
              children="Glömt lösenord?"
            />
            <button>Logga in</button>
          </form>
        </main>
      </Modal>
    )
  }
}

module.exports = LogIn
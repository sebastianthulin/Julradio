const React = require('react')
const User = require('../../services/User')
const Modal = require('./Modal')

class SignUp extends React.Component {
  handleSubmit(ev) {
    ev.preventDefault()
    User.signUp({
      username: this.refs.username.value,
      email: this.refs.email.value,
      password: this.refs.password.value
    }, this.handleError.bind(this))
  }

  handleError(err) {
    alert(err)
  }

  render() {
    return (
      <Modal className="SignUp">
        <header>
          Registrera dig
        </header>
        <main>
          <form ref="form" onSubmit={this.handleSubmit.bind(this)}>
            <label>Användarnamn</label>
            <input ref="username" type="text" />
            <label>Email</label>
            <input ref="email" type="email" />
            <label>Lösenord</label>
            <input ref="password" type="password" />
            <button>Registrera dig</button>
          </form>
        </main>
      </Modal>
    )
  }
}

module.exports = SignUp
const React = require('react')
const Modal = require('../../services/Modal')
const User = require('../../services/User')

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
      <div className="SignUp Modal">
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
            <div className="submit">
              <button>Registrera dig</button>
            </div>
          </form>
        </main>
      </div>
    )
  }
}

module.exports = SignUp
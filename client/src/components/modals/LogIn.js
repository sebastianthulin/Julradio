const React = require('react')
const Modal = require('../../services/Modal')
const User = require('../../services/User')

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
      <div className="LogIn Modal">
        <header>
          Logga in
        </header>
        <main>
          <form onSubmit={this.handleSubmit.bind(this)}>
            <label>Användarnamn</label>
            <input type="text" ref="username" />
            <label>Password</label>
            <input type="password" ref="password" />
            <div className="submit">
              <button>Logga in</button>
            </div>
          </form>
        </main>
      </div>
    )
  }
}

module.exports = LogIn
const React = require('react')
const Modal = require('../../services/Modal')
const User = require('../../services/User')

class LogIn extends React.Component {
  handleSubmit(ev) {
    ev.preventDefault()
    User.logIn({
      username: this.refs.username.value,
      password: this.refs.password.value
    }).catch(this.handleError.bind(this))
  }

  handleError(err) {
    alert(err)
  }

  render() {
    return (
      <div className="modal">
        <header>
          Logga in
        </header>
        <main>
          <form onSubmit={this.handleSubmit.bind(this)}>
            <input type="text" ref="username" placeholder="Användarnamn" />
            <input type="password" ref="password" placeholder="Password" />
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
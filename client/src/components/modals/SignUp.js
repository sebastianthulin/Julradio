const React = require('react')
const Modal = require('../../services/Modal')
const UserStore = require('../../stores/UserStore')

class SignUp extends React.Component {
  handleSubmit(ev) {
    ev.preventDefault()
    UserStore.signUp({
      username: this.refs.username.value,
      email: this.refs.email.value,
      password: this.refs.password.value
    }).then(this.handleUser.bind(this), this.handleError.bind(this))
  }

  handleUser(user) {
    Modal.close()
  }

  handleError(err) {
    alert(err)
  }

  render() {
    return (
      <div className="modal">
        <header>
          Registrera dig
        </header>
        <main>
          <form ref="form" onSubmit={this.handleSubmit.bind(this)}>
            <input ref="username" type="text" placeholder="Användarnamn" />
            <input ref="email" type="email" placeholder="Email" />
            <input ref="password" type="password" placeholder="Lösenord" />
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
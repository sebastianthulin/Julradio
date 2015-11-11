const React = require('react')
const { Link } = require('react-router')
const Modal = require('../../services/Modal')
const User = require('../../services/User')

class LogIn extends React.Component {
  componentWillMount() {
    this.setState({})
  }

  handleSubmit(ev) {
    ev.preventDefault()
    User.logIn({
      username: this.refs.username.value,
      password: this.refs.password.value
    }, this.handleError.bind(this))
  }

  handleForgot(ev) {
    ev.preventDefault()
    User.forgotPassword({
      email: this.refs.forgotEmail.value
    }).then(() => {
      alert('Instruktioner har nu skickats till din email')
      this.setState({
        forgotPassword: false
      })
    }).catch(function(err) {
      alert(err)
    })
  }

  forgotPassword() {
    this.setState({
      forgotPassword: true
    })
  }

  handleError(err) {
    alert(err)
  }

  render() {
    const { forgotPassword } = this.state
    return (
      <div className="LogIn Modal">
        <header>
          Logga in
        </header>
        <main>
          {!forgotPassword ? (
            <form onSubmit={this.handleSubmit.bind(this)}>
              <label>Användarnamn</label>
              <input type="text" ref="username" />
              <label>Password <span onClick={this.forgotPassword.bind(this)} className="forgotPassword">(Glömt?)</span></label>
              <input type="password" ref="password" />
              <div className="submit">
                <button>Logga in</button>
              </div>
            </form>
          ) : (
            <form onSubmit={this.handleForgot.bind(this)}>
              <label>Email</label>
              <input key={1} type="text" ref="forgotEmail" />
              <div className="submit">
                <button>Begär nytt lösenord</button>
              </div>
            </form>
          )}
        </main>
      </div>
    )
  }
}

module.exports = LogIn
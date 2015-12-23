const React = require('react')
const { Link } = require('react-router')
const User = require('../../services/User')
const Modal = require('./Modal')

class LogIn extends React.Component {
  handleSubmit(ev) {
    ev.preventDefault()
    User.logIn({
      username: this.refs.username.value,
      password: this.refs.password.value
    })
    this.setState({disabled: true})
    setTimeout(() => this.setState({disabled: false}), 150)
  }

  render() {
    const { openModal } = this.props
    const { disabled } = this.state || {}
    return (
      <Modal className="LogIn">
        <header>
          Logga in
        </header>
        <main>
          <form onSubmit={this.handleSubmit.bind(this)}>
            <label>Användarnamn</label>
            <input type="text" ref="username" className="clean" />
            <label>Password</label>
            <input type="password" ref="password" className="clean" />
            <div
              className="misq"
              onClick={() => openModal('ForgotPassword')}
              children="Glömt lösenord?"
            />
            <button disabled={disabled}>Logga in</button>
          </form>
        </main>
      </Modal>
    )
  }
}

module.exports = LogIn
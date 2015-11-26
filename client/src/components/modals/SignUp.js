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
    })
    this.setState({disabled: true})
    setTimeout(() => this.setState({disabled: false}), 150)
  }
  
  render() {
    const { disabled } = this.state || {}
    return (
      <Modal className="SignUp">
        <header>
          Registrera dig
        </header>
        <main>
          <form ref="form" onSubmit={this.handleSubmit.bind(this)}>
            <label>Användarnamn</label>
            <input ref="username" type="text" className="clean" />
            <label>Email</label>
            <input ref="email" type="email" className="clean" />
            <label>Lösenord</label>
            <input ref="password" type="password" className="clean" />
            <button disabled={disabled}>Registrera dig</button>
          </form>
        </main>
      </Modal>
    )
  }
}

module.exports = SignUp
const React = require('react')
const {connect} = require('react-redux')
const Modal = require('./Modal')
const {logIn} = require('../../actions/account')

@connect(null, {logIn})
class LogIn extends React.Component {
  handleSubmit(evt) {
    evt.preventDefault()
    this.props.logIn({
      username: this.refs.username.value,
      password: this.refs.password.value
    })
    this.setState({disabled: true})
    setTimeout(() => this.setState({disabled: false}), 150)
  }

  render() {
    const {openModal} = this.props
    const {disabled} = this.state || {}
    return (
      <Modal className="LogIn">
        <header>
          Logga in
        </header>
        <main>
          <form onSubmit={this.handleSubmit.bind(this)}>
            <label>Användarnamn</label>
            <input type="text" ref="username" className="clean" />
            <label>Lösenord</label>
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

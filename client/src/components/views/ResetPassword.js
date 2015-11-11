const React = require('react')
const { Link } = require('react-router')
const User = require('../../services/User')
const request = require('../../services/request')

class ResetPassword extends React.Component {
  componentWillMount() {
    const { id } = this.props.params
    this.state = {request: null}
    request.get('/api/user/reset/' + id).then(({body}) => this.setState({request: body}))
  }

  handleSubmit(ev) {
    const { id } = this.props.params
    ev.preventDefault()
    if (this.refs.password.value !== this.refs.repeatPassword.value)
      return this.handleError('Lösenorden matchar inte')
    User.newPassword({
      request: id,
      password: this.refs.password.value
    }, this.handleError.bind(this))
  }

  handleError(err) {
    alert(err)
  }

  render() {
    const { request } = this.state
    console.log(this.state)
    return !request ? null : (
      <div id="ResetPassword">
        <form onSubmit={this.handleSubmit.bind(this)}>
          <label>Nytt lösenord</label><br/>
          <input type="text" ref="password" /><br/>
          <label>Repetera lösenord</label><br/>
          <input type="text" ref="repeatPassword" /><br/>
          <button>Byt lösenord</button>
        </form>
        <p>Glöm inte av det denna gången!</p>
      </div>
    )
  }
}

module.exports = ResetPassword
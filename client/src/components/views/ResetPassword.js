const React = require('react')
const { Link } = require('react-router')
const User = require('../../services/User')
const request = require('../../services/request')

class ResetPassword extends React.Component {
  componentWillMount() {
    const { id } = this.props.params
    request.get('/api/forgot/' + id).then(res => {
      this.setState({
        request: res.body,
        loaded: true
      })
    }).catch(() => {
      this.setState({loaded: true})
    })
  }

  handleSubmit(ev) {
    ev.preventDefault()
    const { id } = this.props.params
    const password = this.refs.password.value
    User.newPassword(id, password, this.handleError.bind(this))
  }

  handleError(err) {
    alert(err)
  }

  render() {
    const { request, loaded } = this.state || {}
    return !loaded ? null : request ? (
      <div id="ResetPassword">
        <form onSubmit={this.handleSubmit.bind(this)}>
          <label>Nytt lösenord</label><br/>
          <input type="text" ref="password" /><br/>
          <button>Byt lösenord</button>
        </form>
        <p>Glöm inte av det denna gången!</p>
      </div>
    ) : (
      <div>request not even exist</div>
    )
  }
}

module.exports = ResetPassword
const React = require('react')
const request = require('superagent')
const {connect} = require('react-redux')
const {Link} = require('react-router')
const {newPassword} = require('../../actions/account')

@connect(null, {newPassword})
class ResetPassword extends React.Component {
  componentWillMount() {
    const {id} = this.props.params
    request.get('/api/forgot/' + id, (err, {body}) => {
      if (err) {
        this.setState({loaded: true})
      } else {
        this.setState({
          request: body,
          loaded: true
        })
      }
    })
  }

  handleSubmit(evt) {
    const {id} = this.props.params
    const password = this.refs.password.value
    this.props.newPassword(id, password)
    evt.preventDefault()
  }

  render() {
    const {request, loaded} = this.state || {}
    return !loaded ? null : request ? (
      <div id="ResetPassword">
        <form onSubmit={this.handleSubmit.bind(this)}>
          <h2>Nytt lösenord</h2><br/>
          <input className="changeInput" type="password" ref="password" placeholder="Nytt lösenord"/><br/>
          <button className="changeBtn">Byt lösenord</button>
        </form>
        <p>Glöm inte av det denna gången!</p>
      </div>
    ) : (
      <div>...</div>
    )
  }
}

module.exports = ResetPassword

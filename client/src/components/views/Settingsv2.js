const React = require('react')
const User = require('../../services/User')

class Settings extends React.Component {
  componentWillMount() {
    this.unsub = User.subscribe(this.handleUser.bind(this))
  }

  componentWillUnmount() {
    this.unsub()
  }

  handleUser(user) {
    this.initialValues = {
      username: user.username,
      email: user.email,
      password: ''
    }
    this.setState({ user })
  }

  check() {
    const values = {
      username: this.refs.username.getDOMNode().value,
      email: this.refs.email.getDOMNode().value,
      password: this.refs.password.getDOMNode().value
    }

    var changes = []
    for (var i in values) {
      if (values[i] !== this.initialValues[i]) {
        changes.push(i)
      }
    }

    changes = changes.join(', ').replace(/, (?=[^,]*$)/, ' & ')

    if (changes !== this.state.changes) {
      this.setState({ changes })
    }
  }

  saveFields() {

  }

  renderConfirmation() {
    return (
      <label className="ani">
        <form onSubmit={this.saveFields.bind(this)}>
          <div className="label">Current Password</div>
          <input type="password" ref="current" style={{width: 300}} />
          <button>Save</button>
          <p>{'To save changes to your ' + this.state.changes + ' you must enter your current password.'}</p>
        </form>
      </label>
    )
  }

  render() {
    const { user, changes } = this.state
    return (
      <div id="settings-v2">
        <h1>Inställningar</h1>
        <div>
          <h2>Allmänt</h2>
          <label>
            <div className="label">Username</div>
            <input type="text" defaultValue={user.username} ref="username" onChange={this.check.bind(this)} />
          </label>
          <label>
            <div className="label">Email</div>
            <input type="text" defaultValue={user.email} ref="email" onChange={this.check.bind(this)} />
          </label>
          <label>
            <div className="label">New Password</div>
            <input type="password" ref="password" onChange={this.check.bind(this)} />
          </label>
          {changes && this.renderConfirmation()}
        </div>
      </div>
    )
  }
}

module.exports = Settings
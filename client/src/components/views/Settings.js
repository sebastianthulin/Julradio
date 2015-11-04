const React = require('react')
const User = require('../../services/User')

class Settings extends React.Component {
  componentWillMount() {
    this.timeouts = {}
    this.unsub = User.subscribe(this.handleUser.bind(this))
  }

  componentWillUnmount() {
    this.unsub()
  }

  handleUser(user) {
    this.initialValues = {
      email: user.email,
      password: ''
    }

    this.setState({ user })
  }

  check() {
    var changes = []
    const values = {
      email: this.refs.email.value,
      password: this.refs.password.value
    }

    for (var i in values) {
      if (values[i] !== this.initialValues[i]) {
        changes.push({
          email: 'email',
          password: 'lösenord'
        }[i])
      }
    }

    changes = changes.join(', ').replace(/, (?=[^,]*$)/, ' & ')

    if (changes !== this.state.changes) {
      this.setState({ changes })
    }
  }

  saveFields(ev) {
    ev.preventDefault()
    User.updateSettings({
      email: this.refs.email.value,
      password: this.refs.password.value,
      auth: this.refs.auth.value
    }).then(user => {
      this.handleUser(user)
      this.setState({changes: null})
      this.refs.password.value = ''
    }).catch(err => {
      alert(err)
    })
  }

  save(ev) {
    const field = ev.target.name
    const value = ev.target.value
    clearTimeout(this.timeouts[field])
    this.timeouts[field] = setTimeout(this.save2.bind(this, { field, value }), 500)
  }

  save2(opts) {
    User.updateField(opts).then(() => {
      console.log('saved.')
    }).catch(this.handleError.bind(this))
  }

  setAvatar(ev) {
    const file = ev.target.files[0]
    User.setAvatar(file).then(() => {
      alert('profilbild uppdaterad.')
    }).catch(this.handleError.bind(this))
  }

  handleError(err) {
    console.log(err)
    alert('gick inte att spara')
  }

  renderConfirmation() {
    const { changes } = this.state
    return (
      <form onSubmit={this.saveFields.bind(this)} className="ani">
        <label>
          <div className="label">Nuvarande lösenord</div>
          <input type="password" ref="auth" />
        </label>
        <div className="confirmation">
          <p>{`För att ändra din ${changes} så måste du skriva in ditt nuvarande lösenord.`}</p>
          <button>Save</button>
        </div>
      </form>
    )
  }

  render() {
    const { user, changes } = this.state
    return (
      <div id="Settings">
        <h1>Profilinställningar</h1>
        <div>
          <label>
            <div className="label">Email</div>
            <input
              type="text"
              defaultValue={user.email}
              ref="email"
              onChange={this.check.bind(this)}
            />
          </label>
          <label>
            <div className="label">Lösenord</div>
            <input
              type="password"
              ref="password"
              placeholder="Skriv in nytt lösenord"
              onChange={this.check.bind(this)}
            />
          </label>
          {changes && this.renderConfirmation()}
          <label>
            <div className="label">IRL namn</div>
            <input
              type="text"
              defaultValue={user.name}
              name="name"
              onChange={this.save.bind(this)}
            />
          </label>
          <label>
            <div className="label">Kön</div>
            <select defaultValue={user.gender} name="gender" onChange={this.save.bind(this)}>
              <option value="">Välj</option>
              <option value="MALE">Pojke</option>
              <option value="FEMALE">Flicka</option>
            </select>
          </label>
          <label>
            <div className="label">Bor</div>
            <input
              type="text"
              defaultValue={user.location}
              name="location"
              onChange={this.save.bind(this)}
            />
          </label>
          <label>
            <div className="label">Födelsedag</div>
            <input
              type="text"
              name="birth"
            />
          </label>
          <label>
            <div className="label">Personlig beskrivning</div>
            <textarea
              defaultValue={user.description}
              name="description"
              placeholder="— (500 tecken högst)"
              maxLength={500}
              onChange={this.save.bind(this)}
            />
          </label>
          <label>
            <div className="label">Profilbild</div>
            <input
              type="file"
              onChange={this.setAvatar.bind(this)}
            />
          </label>
        </div>
      </div>
    )
  }
}

module.exports = Settings
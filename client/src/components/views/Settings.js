const React = require('react')
const User = require('../../services/User')
const NotificationStore = require('../../stores/NotificationStore')

const months = [
  'Januari',
  'Februari',
  'Mars',
  'April',
  'Maj',
  'Juni',
  'Juli',
  'Augusti',
  'September',
  'Oktober',
  'November',
  'December'
]

const days = []
for (let i = 1; i <= 31; i++) {
  days.push(i)
}

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
    User.update2({
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
    User.update({
      name: this.refs.name.value,
      gender: this.refs.gender.value,
      location: this.refs.location.value,
      description: this.refs.description.value,
      year: Number(this.refs.year.value),
      month: Number(this.refs.month.value),
      day: Number(this.refs.day.value)
    }).then(() => {
      NotificationStore.insert({type: 'settings'})
    }).catch(err => {
      console.log(err)
      NotificationStore.error({type: 'settings', value: err})
    })
  }

  setAvatar(ev) {
    const file = ev.target.files[0]
    User.setAvatar(file).then(() => {
      NotificationStore.insert({
        type: 'profilepicture'
      })
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
        <label className="setting">
          <div className="label">Nuvarande lösenord</div>
          <input type="password" ref="auth" />
        </label>
        <div className="confirmation">
          <p>{`För att ändra din ${changes} så måste du skriva in ditt nuvarande lösenord.`}</p>
          <button className="btn">Spara</button>
        </div>
      </form>
    )
  }

  render() {
    const { user, changes } = this.state
    const dob = new Date(user.birth)
    return (
      <div id="Settings">
        <h1>Profilinställningar</h1>
        <div>
          <label className="setting">
            <div className="label">Email</div>
            <input
              type="text"
              defaultValue={user.email}
              ref="email"
              onChange={this.check.bind(this)}
            />
          </label>
          <label className="setting">
            <div className="label">Lösenord</div>
            <input
              type="password"
              ref="password"
              placeholder="Skriv in nytt lösenord"
              onChange={this.check.bind(this)}
            />
          </label>
          {changes && this.renderConfirmation()}
          <label className="setting">
            <div className="label">Namn</div>
            <input
              type="text"
              defaultValue={user.name}
              ref="name"
            />
          </label>
          <label className="setting">
            <div className="label">Kön</div>
            <select defaultValue={user.gender} ref="gender">
              <option value="">Välj</option>
              <option value="MALE">Pojke</option>
              <option value="FEMALE">Flicka</option>
            </select>
          </label>
          <label className="setting">
            <div className="label">Bor</div>
            <input
              type="text"
              defaultValue={user.location}
              ref="location"
            />
          </label>
          <label className="setting">
            <div className="label">Födelsedag</div>
            <div>
              <input
                type="text"
                defaultValue={dob.getFullYear()}
                ref="year"
                style={{width: '33%'}}
              />
              <select ref="month" defaultValue={dob.getMonth()} style={{width: '33%'}}>
                {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
              </select>
              <select ref="day" defaultValue={dob.getDate()} style={{width: '33%'}}>
                {days.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </label>
          <label className="setting">
            <div className="label">Personlig beskrivning</div>
            <textarea
              defaultValue={user.description}
              ref="description"
              placeholder="— (500 tecken högst)"
              maxLength={500}
            />
          </label>
          <label className="setting">
            <div className="label">Profilbild</div>
            <input
              type="file"
              onChange={this.setAvatar.bind(this)}
            />
          </label>
          <button
            children="Spara"
            className="btn"
            style={{float: 'right', marginRight: 0}}
            onClick={this.save.bind(this)}
          />
        </div>
      </div>
    )
  }
}

module.exports = Settings
const React = require('react')
const {connect} = require('react-redux')
const {openModal} = require('../../actions/modal')
const User = require('../../services/User')
const ProfilePicture = require('../reusable/ProfilePicture')

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

@connect(null, {openModal})
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

    this.setState({user})
  }

  check() {
    let changes = []
    const values = {
      email: this.refs.email.value,
      password: this.refs.password.value
    }

    for (let i in values) {
      if (values[i] !== this.initialValues[i]) {
        changes.push({
          email: 'email',
          password: 'lösenord'
        }[i])
      }
    }

    changes = changes.join(', ').replace(/, (?=[^,]*$)/, ' & ')

    if (changes !== this.state.changes) {
      this.setState({changes})
    }
  }

  saveFields(ev) {
    ev.preventDefault()
    User.update2({
      email: this.refs.email.value,
      password: this.refs.password.value,
      auth: this.refs.auth.value
    }, user => {
      this.handleUser(user)
      this.setState({changes: null})
      this.refs.password.value = ''
    })
  }

  save(ev) {
    User.update({
      name: this.refs.name.value,
      gender: this.refs.gender.value,
      location: this.refs.location.value,
      description: this.refs.description.value,
      year: parseInt(this.refs.year.value),
      month: parseInt(this.refs.month.value),
      day: parseInt(this.refs.day.value)
    })
  }

  renderConfirmation() {
    const {changes} = this.state
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
    const {openModal} = this.props
    const {user, changes} = this.state
    return (
      <div id="Settings">
        <h1>Profilinställningar</h1>
        <div>
          <label className="setting">
            <div className="label">Email</div>
            <input
              type="text"
              maxLength={254}
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
              maxLength={50}
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
              maxLength={50}
              defaultValue={user.location}
              ref="location"
            />
          </label>
          <label className="setting">
            <div className="label">Födelsedag</div>
            <div>
              <input
                type="text"
                defaultValue={user.birth && user.birth.getFullYear()}
                ref="year"
                placeholder="År"
                maxLength={4}
                style={{width: '33%', minWidth: '33%'}}
              />
              <select ref="month" defaultValue={user.birth && user.birth.getMonth()} style={{width: '33%', minWidth: '33%'}}>
                <option value="">Månad</option>
                {months.map((m, i) => <option key={i} value={i} children={m} />)}
              </select>
              <select ref="day" defaultValue={user.birth && user.birth.getDate()} style={{width: '33%', minWidth: '33%'}}>
                <option value="">Dag</option>
                {days.map(d => <option key={d} value={d} children={d} />)}
              </select>
            </div>
          </label>
          <label className="setting">
            <div className="label">Profilbild</div>
            <ProfilePicture id={user.picture} />
            <div style={{marginLeft: 10}} onClick={() => openModal('ChangeAvatar')}>Ändra</div>
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

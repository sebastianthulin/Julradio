const React = require('react')
const {connect} = require('react-redux')
const ProfilePicture = require('../reusable/ProfilePicture')
const {updateAccountSettings, updateAccountSettings2} = require('../../actions/account')
const {openModal} = require('../../actions/modal')
const {createNotification} = require('../../actions/notifications')

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

const days = Array.from(Array(31), (_, i) => i + 1)

@connect(state => ({
  user: state.account
}), {
  onUpdateAccountSettings: updateAccountSettings, 
  onUpdateAccountSettings2: updateAccountSettings2,
  onOpenModal: openModal,
  onCreateNotification: createNotification
})
class Settings extends React.Component {
  componentWillMount() {
    this.state = {}
    this.timeouts = {}
  }

  check() {
    let changes = []
    const initialValues = {
      email: this.props.user.email,
      password: ''
    }
    const values = {
      email: this.refs.email.value,
      password: this.refs.password.value
    }

    for (let i in values) {
      if (values[i] !== initialValues[i]) {
        changes.push({email: 'email', password: 'lösenord'}[i])
      }
    }

    changes = changes.join(', ').replace(/, (?=[^,]*$)/, ' & ')

    if (changes !== this.state.changes) {
      this.setState({changes})
    }
  }

  saveFields(evt) {
    evt.preventDefault()
    this.props.onUpdateAccountSettings2({
      email: this.refs.email.value,
      password: this.refs.password.value,
      auth: this.refs.auth.value
    }).then(() => {
      this.setState({changes: null})
      this.refs.password.value = ''
    })
  }

  save() {
    this.props.onUpdateAccountSettings({
      name: this.refs.name.value,
      gender: this.refs.gender.value,
      location: this.refs.location.value,
      description: this.refs.description.value,
      year: parseInt(this.refs.year.value),
      month: parseInt(this.refs.month.value),
      day: parseInt(this.refs.day.value)
    }).then(() => {
      this.props.onCreateNotification({name: 'settings'})
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
    const {changes} = this.state
    const {user, onOpenModal} = this.props
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
            <div style={{marginLeft: 10}} onClick={() => onOpenModal('ChangeAvatar')}>Ändra</div>
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

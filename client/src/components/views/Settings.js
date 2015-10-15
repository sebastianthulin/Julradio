const React = require('react')
const User = require('../../services/User')

class Settings extends React.Component {
  componentWillMount() {
    this.unsub = User.subscribe(user => this.setState({ user }))
  }

  componentWillUnmount() {
    this.unsub()
  }

  save() {
    User.updateSettings({
      email: this.refs.email.value,
      realname: this.refs.realname.value,
      description: this.refs.description.value,
      gender: this.refs.gender.value,
      location: this.refs.location.value
    }).then(user => {
      alert('inställningar sparade.')
    }).catch(this.handleError.bind(this))
  }

  savePassword() {
    User.updatePassword({
      current: this.refs.currentPassword.value,
      new: this.refs.newPassword.value,
      repeat: this.refs.repeatPassword.value
    }).then(() => {
      this.refs.currentPassword.value = ''
      this.refs.newPassword.value = ''
      this.refs.repeatPassword.value = ''
      alert('lösenord uppdaterat.')
    }).catch(this.handleError.bind(this))
  }

  setAvatar(ev) {
    const file = ev.target.files[0]
    User.setAvatar(file).then(() => {
      alert('profilbild uppdaterad.')
    }).catch(this.handleError.bind(this))
  }

  handleError(err) {
    alert(err)
  }

  render() {
    const { user } = this.state
    return (
      <div id="settings" className="row content">
        <div className="one-third column">
          <h4>Allmänt</h4>
          <div>
            <input className="settingsInput" type="text" defaultValue={user.email} ref="email" placeholder="Email"/>
          </div>
          <div>
            <input className="settingsInput" type="text" defaultValue={user.realname} ref="realname" placeholder="IRL Namn"/>
          </div>
          <select defaultValue={user.gender} ref="gender">
            <option value="">Kön</option>
            <option value="male">Pojke</option>
            <option value="female">Flicka</option>
          </select>
          <div>
            <input className="settingsInput" type="text" defaultValue={user.location} ref="location" placeholder="Bor"/>
          </div>
          <div>
            <textarea className="settingsInput settingsInputArea" defaultValue={user.description} ref="description" placeholder="Personlig beskrivning"/>
          </div>
          <button className="settingsSave" onClick={this.save.bind(this)}>Spara ändringar</button>
        </div>
        <div className="one-third column">
          <h4>Lösenord</h4>
          <div>
            <input className="settingsInput" type="password" ref="currentPassword" placeholder="Nuvarande lösenord"/>
          </div>
          <div>
            <input className="settingsInput" type="password" ref="newPassword" placeholder="Nytt lösenord"/>
          </div>
          <div>
            <input className="settingsInput" type="password" ref="repeatPassword" placeholder="Repetera"/>
          </div>
          <button className="settingsSave" onClick={this.savePassword.bind(this)}>Spara lösenord</button>
        </div>
        <div className="one-third column">
          <h4>Profilbild</h4>
          <input type="file" onChange={this.setAvatar.bind(this)} />
          <br/>
          högst 2mb
          <br/>
          Helst en kvadrat
        </div>
      </div>
    )
  }
}

module.exports = Settings
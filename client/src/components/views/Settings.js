const React = require('react')
const UserStore = require('../../stores/UserStore')

class Settings extends React.Component {
  componentWillMount() {
    this.unsub = UserStore.subscribe(user => this.setState({ user }))
  }

  componentWillUnmount() {
    this.unsub()
  }

  save() {
    UserStore.updateSettings({
      email: this.refs.email.value,
      realname: this.refs.realname.value,
      description: this.refs.description.value
    }).then(user => {
      alert('inställningar sparade.')
    }).catch(this.handleError.bind(this))
  }

  savePassword() {
    UserStore.updatePassword({
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
    UserStore.setAvatar(file).then(() => {
      alert('profilbild uppdaterad.')
    }).catch(this.handleError.bind(this))
  }

  handleError(err) {
    alert(err)
  }

  render() {
    const { user } = this.state
    return (
      <div className="row content">
        <div className="one-third column">
          <h4>Allmänt</h4>
          <div>
            <h6>Email</h6>
            <input type="text" defaultValue={user.email} ref="email" />
          </div>
          <div>
            <h6>IRL namn</h6>
            <input type="text" defaultValue={user.realname} ref="realname" />
          </div>
          <div>
            <h6>Description</h6>
            <textarea defaultValue={user.description} ref="description" />
          </div>
          <div>
            <h6>DOB</h6>
            ...
          </div>
          <button onClick={this.save.bind(this)}>Spara ändringar</button>
        </div>
        <div className="one-third column">
          <h4>Lösenord</h4>
          <div>
            <h6>Nuvarande lösenord</h6>
            <input type="password" ref="currentPassword" />
          </div>
          <div>
            <h6>Nytt lösenord</h6>
            <input type="password" ref="newPassword" />
          </div>
          <div>
            <h6>Repetera</h6>
            <input type="password" ref="repeatPassword" />
          </div>
          <button onClick={this.savePassword.bind(this)}>Spara lösenord</button>
        </div>
        <div className="one-third column">
          <h4>Profilbild</h4>
          <input type="file" onChange={this.setAvatar.bind(this)} />
          <p>högst 2mb</p>
        </div>
      </div>
    )
  }
}

module.exports = Settings
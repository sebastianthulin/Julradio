const React = require('react')
const User = require('../../services/User')
const NotificationStore = require('../../stores/NotificationStore')
const ProfilePicture = require('../reusable/ProfilePicture')
const Modal = require('./Modal')

class ChangeAvatar extends React.Component {
  componentWillMount() {
    this.unsub = User.subscribe(user => this.setState({ user }))
  }

  componentWillUnmount() {
    this.unsub()
  }

  remove() {
    this.setState({removed: true, avatarPreview: null})
  }

  browse() {
    this.refs.input.click()
  }

  set(ev) {
    const file = ev.target.files[0]
    this.setState({
      removed: false,
      avatarPreview: URL.createObjectURL(file)
    })
  }

  save() {
    if (this.state.removed) {
      User.removeAvatar(this.done.bind(this))
    } else if (this.state.avatarPreview) {
      const avatar = this.refs.input.files[0]
      User.setAvatar(avatar, this.done.bind(this))
    }
  }

  done() {
    this.props.closeModal()
    NotificationStore.insert({
      type: 'profilepicture'
    })
  }

  render() {
    const { user, removed, avatarPreview } = this.state
    return (
      <Modal className="ChangeAvatar">
        <header>
          Ändra profilbild
        </header>
        <main>
          <input
            type="file"
            ref="input"
            accept="image/*"
            onChange={this.set.bind(this)}
            hidden
          />
          {avatarPreview && <div className="avatarPreview" style={{backgroundImage: `url(${avatarPreview})`}} />}
          {!avatarPreview && <ProfilePicture id={removed ? null : user.picture} />}
          <button onClick={this.browse.bind(this)}>Ändra</button>
          <button onClick={this.remove.bind(this)}>Ta bort</button>
          <button onClick={this.save.bind(this)}>Spara</button>
        </main>
      </Modal>
    )
  }
}

module.exports = ChangeAvatar
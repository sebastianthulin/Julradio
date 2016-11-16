const React = require('react')
const {connect} = require('react-redux')
const ProfilePicture = require('../reusable/ProfilePicture')
const Modal = require('./Modal')
const {setAvatar, removeAvatar} = require('../../actions/account')
const {createNotification} = require('../../actions/notifications')

@connect(state => ({
  user: state.account
}), {
  onSetAvatar: setAvatar,
  onRemoveAvatar: removeAvatar,
  onCreateNotification: createNotification
})
class ChangeAvatar extends React.Component {
  set(evt) {
    const file = evt.target.files[0]
    this.setState({
      removed: false,
      avatarPreview: URL.createObjectURL(file)
    })
  }

  save() {
    const {props, refs} = this
    const state = this.state || {}

    const done = () => {
      props.closeModal()
      props.onCreateNotification({name: 'profilepicture'})
    }

    if (state.removed) {
      props.onRemoveAvatar().then(done)
    } else if (state.avatarPreview) {
      const avatar = refs.input.files[0]
      props.onSetAvatar(avatar).then(done)
    }
  }

  render() {
    const {user} = this.props
    const {removed, avatarPreview} = this.state || {}
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
          {avatarPreview && (
            <div className="avatarPreview" style={{backgroundImage: `url(${avatarPreview})`}} />
          )}
          {!avatarPreview && (
            <ProfilePicture id={removed ? null : user.picture} />
          )}
          <button onClick={() => this.refs.input.click()}>
            Ändra
          </button>
          <button onClick={() => this.setState({removed: true, avatarPreview: null})}>
            Ta bort
          </button>
          <button onClick={this.save.bind(this)}>
            Spara
          </button>
        </main>
      </Modal>
    )
  }
}

module.exports = ChangeAvatar

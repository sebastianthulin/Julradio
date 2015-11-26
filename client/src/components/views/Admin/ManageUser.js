const React = require('react')
const { Link } = require('react-router')
const UserStore = require('../../../stores/UserStore')

class ManageUser extends React.Component {
  save() {
    UserStore.updateUserSettings(this.props.user._id, {
      username: this.refs.username.value,
      title: this.refs.title.value,
      admin: this.refs.admin.checked,
      writer: this.refs.writer.checked,
      radioHost: this.refs.radioHost.checked,
      banned: this.refs.banned.checked
    }, function() {
      alert('Ändringar sparade.')
    })
  }

  removeAvatar() {
    UserStore.removeUserAvatar(this.props.user._id, function() {
      alert('Borttagen.')
    })
  }

  render() {
    const { user } = this.props
    return (
      <div className="oneHalf column">
        <label className="setting">
          <div className="label">Användarnamn</div>
          <input
            type="text"
            defaultValue={user.username}
            ref="username"
          />
        </label>
        <label className="setting">
          <div className="label">Titel</div>
          <input
            type="text"
            defaultValue={user.title}
            ref="title"
          />
        </label>
        <div className="setting">
          <div className="label">Roller</div>
          <div>
            <label>
              <input type="checkbox" defaultChecked={user.roles.admin} ref="admin" />
              Admin
            </label>
            <label>
              <input type="checkbox" defaultChecked={user.roles.writer} ref="writer" />
              Skribent
            </label>
            <label>
              <input type="checkbox" defaultChecked={user.roles.radioHost} ref="radioHost" />
              Radiopratare
            </label>
          </div>
        </div>
        <div className="setting">
          <div className="label">Bannad</div>
          <div>
            <input type="checkbox" defaultChecked={user.banned} ref="banned" />
          </div>
        </div>
        {user.picture && <img class="manageUserPic" src={'/picture/' + user.picture} width="200" />}
        {user.picture && <button className="removePic" onClick={this.removeAvatar.bind(this)}>Ta bort bild</button>}
        <button className="btn" onClick={this.save.bind(this)}>Spara ändringar</button>
        <Link to={`/@${user.username}`} style={{marginLeft: 10}}>Visa profil</Link>
      </div>
    )
  }
}

module.exports = ManageUser
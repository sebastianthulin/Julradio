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
    }).then(function() {
      alert('Ändringar sparade.')
    }).catch(function(err) {
      console.error(err)
      alert('Ett fel uppstod. Öppna upp konsollen för detaljer.')
    })
  }

  render() {
    const { user, user: { picture } } = this.props
    return (
      <div className="oneHalf column">
        <div>
          <h6>Användarnamn</h6>
          <input type="text" defaultValue={user.username} ref="username" />
        </div>
        <div>
          <h6>Titel</h6>
          <input type="text" defaultValue={user.title} ref="title" />
        </div>
        {picture && <img src={'/i/' + picture._id + picture.extension} width="100" />}
        {picture && <button>Ta bort bild</button>}
        <div>
          <h6>Roller</h6>
          Admin
          <input type="checkbox" defaultChecked={user.roles.admin} ref="admin" />
          Skribent
          <input type="checkbox" defaultChecked={user.roles.writer} ref="writer" />
          Radiopratare
          <input type="checkbox" defaultChecked={user.roles.radioHost} ref="radioHost" />
        </div>
        <div>
          <h6>Bannad</h6>
          <input type="checkbox" defaultChecked={user.banned} ref="banned" />
        </div>
        <button onClick={this.save.bind(this)}>Spara ändringar</button>
        <Link to={`/@${user.username}`}>Visa profil</Link>
      </div>
    )
  }
}

module.exports = ManageUser
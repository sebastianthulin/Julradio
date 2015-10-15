const React = require('react')
const UserStore = require('../../../stores/UserStore')

class ManageUser extends React.Component {
  save() {
    UserStore.updateUserSettings(this.props.user._id, {
      username: this.refs.username.value,
      title: this.refs.title.value,
      admin: this.refs.admin.checked
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
      <div className="one-half column">
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
          <h6>Admin</h6>
          <input type="checkbox" defaultChecked={user.admin} ref="admin" />
        </div>
        <button onClick={this.save.bind(this)}>Spara ändringar</button>
        <button>Banna</button>
      </div>
    )
  }
}

module.exports = ManageUser
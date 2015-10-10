const React = require('react')
const UserStore = require('../../stores/UserStore')

const VIEW_PROFILE = 'VIEW_PROFILE'
const EDIT_PROFILE = 'EDIT_PROFILE'

class UserProfile extends React.Component {
  componentWillMount() {
    this.setUser(this.props.params.username)
  }

  componentWillReceiveProps(props) {
    this.setUser(props.params.username)
  }

  setUser(username) {
    UserStore.getByUsername(username).then(user => this.setState({ user }))
  }

  render() {
    const { user } = this.state || {}
    if (!user) return null

    return (
      <div className="row content">
        <div className="profileBox">
          <div className="profPicture"></div>

          {false && <div className="profPM">Skicka Meddelande</div>}
          <div className="profName">{user.username}</div>

          <div className="profAge">Göteborg, 20 År</div>
          <div className="profText">
            <div className="profTextBox">{user.description}</div>
          </div>
        </div>
      </div>
    )
  }
}

module.exports = UserProfile
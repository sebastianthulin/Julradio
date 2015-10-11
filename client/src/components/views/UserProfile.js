const React = require('react')
const UserStore = require('../../stores/UserStore')
const { Link } = require('react-router')

class UserProfile extends React.Component {
  componentWillMount() {
    this.authedUser = (UserStore.get() || {})._id
    this.setUser(this.props.params.username)
  }

  componentWillReceiveProps(props) {
    this.setUser(props.params.username)
  }

  setUser(username) {
    UserStore.getByUsername(username, user => this.setState({ user }))
  }

  render() {
    const { user } = this.state || {}
    if (!user) return null

    return (
      <div className="row content">
        <div className="profileBox">
          <div className="profPicture">
            {user.picture && <img src={'/i/' + user.picture._id + user.picture.extension} alt="Profilbild" />}
          </div>
          {this.authedUser !== user._id && <Link to={`/messages/${user.username}`} className="profPM">Skicka Meddelande</Link>}
          <div className="profName">{user.username}</div>
          {user.title && <div className="title">{user.title}</div>}
          <div className="profAge">Göteborg, 20 år</div>
          <div className="profText">
            <div className="profTextBox">{user.description}</div>
          </div>
        </div>
      </div>
    )
  }
}

module.exports = UserProfile
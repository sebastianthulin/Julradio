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
          <div className="profText">{user.description}</div>
        </div>

        <div className="wall">
          <input type="text" className="wallMessage" placeholder="Skriv ett inlägg i gästboken"/>
          <div className="wallPost">
            <div className="wallPostAuthor">
              <div className="wallPostAuthorPicture"></div>
              <div className="wallPostAuthorName">Oliver Johansson</div>
              <div className="wallPostAuthorTime">3 dagar sedan</div>
            </div>
            <div className="wallPostText">Gud va du är söt asså wow. Gillar du också pepparkakor? Ska vi bli tillsammans?</div>
          </div>

          <div className="wallPost">
            <div className="wallPostAuthor">
              <div className="wallPostAuthorPicture"></div>
              <div className="wallPostAuthorName">Oliver Johansson</div>
              <div className="wallPostAuthorTime">3 dagar sedan</div>
            </div>
            <div className="wallPostText">Lilla snigel akta dig, akta dig, akta dig</div>
          </div>

          <div className="wallPost">
            <div className="wallPostAuthor">
              <div className="wallPostAuthorPicture"></div>
              <div className="wallPostAuthorName">Oliver Johansson</div>
              <div className="wallPostAuthorTime">365 dagar sedan</div>
            </div>
            <div className="wallPostText">Grattis på födelsedagen din lilla fjärt</div>
          </div>

        </div>

      </div>
    )
  }
}

module.exports = UserProfile
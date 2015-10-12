const React = require('react')
const User = require('../../services/User')
const UserStore = require('../../stores/UserStore')
const { Link } = require('react-router')

const WallPost = ({ text, from: user }) => (
  <div className="wallPost">
    <div className="wallPostAuthor">
      {user.picture && <div className="wallPostAuthorPicture" style={{backgroundImage: `url('/i/${user.picture._id + user.picture.extension}')`}} />}
      <Link to={'/@' + user.username} className="wallPostAuthorName">{user.username}</Link>
      <div className="wallPostAuthorTime">3 dagar sedan</div>
    </div>
    <div className="wallPostText">{text}</div>
  </div>
)

class UserProfile extends React.Component {
  componentWillMount() {
    this.authedUser = (User.get() || {})._id
    this.state = {}
    this.setUser(this.props.params.username)
  }

  componentWillReceiveProps(props) {
    this.setUser(props.params.username)
  }

  setUser(username) {
    this.state.posts = []
    UserStore.getByUsername(username, this.handleUser.bind(this))
  }

  handleUser(user) {
    this.setState({ user })
    this.getWallPosts(user._id)
  }

  getWallPosts(userId) {
    UserStore.getWallPosts(userId, posts => this.setState({ posts }))
  }

  wallPost(ev) {
    ev.preventDefault()
    const text = this.refs.wallInput.value.trim()
    this.refs.wallInput.value = ''
    if (!text) return
    User.wallPost(this.state.user._id, text).then(() => {
      this.getWallPosts(this.state.user._id)
    }).catch(err => {
      alert('något gick fel.')
    })
  }

  render() {
    const { user, posts } = this.state
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
          <form onSubmit={this.wallPost.bind(this)}>
            <input type="text" ref="wallInput" className="wallMessage" placeholder="Skriv ett inlägg i gästboken" />
          </form>
          {posts && posts.map(post => <WallPost key={post._id} {...post} />)}
        </div>
      </div>
    )
  }
}

module.exports = UserProfile
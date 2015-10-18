const React = require('react')
const User = require('../../services/User')
const UserStore = require('../../stores/UserStore')
const TimeSince = require('../reusable/TimeSince')
const ProfilePicture = require('../reusable/ProfilePicture')
const { Link } = require('react-router')

class WallPost extends React.Component {
  render() {
    const { _id, text, date, from: user, removable, onDelete } = this.props
    return (
      <div className="wallPost">
        <div className="wallPostAuthor">
          {user.picture && <ProfilePicture {...user.picture} />}
          <Link to={'/@' + user.username} className="wallPostAuthorName">{user.username}</Link>
          <TimeSince className="wallPostAuthorTime" date={date} />
        </div>
        <div className="wallPostText">{text}</div>
        {removable && <div><button onClick={onDelete}>Radera</button></div>}
      </div>
    )
  }
}

class UserProfile extends React.Component {
  componentWillMount() {
    this.authedUser = User.get() || {}
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

  deleteWallPost(id) {
    if (!confirm('Ta bort inlägg?')) {
      return
    }

    User.deleteWallPost(id).then(() => {
      this.getWallPosts(this.state.user._id)
    }).catch(err => {
      alert('Något gick fel', err)
    })
  }

  render() {
    const { user, posts } = this.state
    if (!user) return null

    return (
      <div className="row content">
        <div className="profileBox">
          {user.picture && <ProfilePicture {...user.picture} />}
          {this.authedUser._id !== user._id && <Link to={`/messages/${user.username}`} className="profPM">Skicka Meddelande</Link>}
          <div className="profName">{user.username}</div>
          {user.title && <div className="title">{user.title}</div>}
          <div className="profAge">{user.location && user.location + ','} {user.gender} 20 år</div>
          <div className="profText">{user.description}</div>
          Joined {user.date}
        </div>

        <div className="wall">
          <form onSubmit={this.wallPost.bind(this)}>
            <input type="text" ref="wallInput" className="wallMessage" placeholder="Skriv ett inlägg i gästboken" />
          </form>
          {posts && posts.map(post => <WallPost key={post._id} {...post} removable={this.authedUser._id === user._id || this.authedUser._id === post.from._id || this.authedUser.admin} onDelete={this.deleteWallPost.bind(this, post._id)} />)}
        </div>
      </div>
    )
  }
}

module.exports = UserProfile
const React = require('react')
const { Link } = require('react-router')
const User = require('../../../services/User')
const UserStore = require('../../../stores/UserStore')
const ProfilePicture = require('../../reusable/ProfilePicture')
const Wall = require('./Wall')
const ProfileOptions = require('./ProfileOptions')

class UserProfile extends React.Component {
  componentWillMount() {
    this.authedUser = User.get() || {}
    this.state = {}
    this.setUser(this.props.params.username)
  }

  getRelationship() {
    // Hämtar info om profilens relation till din användare:
    // isBlocked, hasBlocked etc.

    const { user } = this
    User.getProfile(user._id, (relationship) => this.setState({ relationship }))
  }

  componentWillReceiveProps(props) {
    this.setUser(props.params.username)
  }

  setUser(username) {
    this.state.posts = []
    UserStore.getByUsername(username, this.handleUser.bind(this))
  }

  handleUser(user) {
    this.user = user
    this.setState({ user })
    this.getWallPosts(user._id)
    if (user._id !== this.authedUser._id) {
      this.getRelationship()
    }
  }

  getWallPosts(userId) {
    UserStore.getWallPosts(userId, posts => this.setState({ posts }))
  }

  submitWallPost(text) {
    User.wallPost(this.state.user._id, text).then(() => {
      this.getWallPosts(this.state.user._id)
    }).catch(err => {
      alert('något gick fel.')
    })
  }

  deleteWallPost(id) {
    User.deleteWallPost(id).then(() => {
      this.getWallPosts(this.state.user._id)
    }).catch(err => {
      alert('Något gick fel', err)
    })
  }

  render() {
    const { user, posts, relationship } = this.state
    if (!user) return null

    return (
      <div id="UserProfile">
        <header>
          <ProfilePicture {...user.picture} />
          {this.authedUser._id !== user._id && <ProfileOptions user={user} relationship={relationship} getRelationship={this.getRelationship.bind(this)}/>}
          <div className="username">{user.username}</div>
          {user.title && <div className="title">{user.title}</div>}
          <div className="age">{user.location && user.location + ','} {user.gender} 20 år</div>
          <div className="description">{user.description}</div>
          <div>{'Joined ' + user.date}</div>
        </header>
        <Wall
          user={user}
          authedUser={this.authedUser}
          relationship={relationship}
          posts={posts}
          onSubmit={this.submitWallPost.bind(this)}
          onDelete={this.deleteWallPost.bind(this)}
        />
      </div>
    )
  }
}

module.exports = UserProfile
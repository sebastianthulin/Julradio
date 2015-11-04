const React = require('react')
const { Link } = require('react-router')
const User = require('../../../services/User')
const ProfilePicture = require('../../reusable/ProfilePicture')
const Wall = require('./Wall')
const ProfileOptions = require('./ProfileOptions')

class UserProfile extends React.Component {
  componentWillMount() {
    this.authedUser = User.get() || {}
  }

  submitWallPost(text) {
    const userId = this.props.user._id
    User.wallPost(userId, text).then(() => {
      this.props.onQuery('wallposts')
    }).catch(err => {
      alert('något gick fel.', err)
    })
  }

  deleteWallPost(id) {
    const userId = this.props.user._id
    User.deleteWallPost(id).then(() => {
      this.props.onQuery('wallposts')
    }).catch(err => {
      alert('Något gick fel', err)
    })
  }

  render() {
    const { authedUser } = this
    const {
      onQuery,
      user,
      block: relationship,
      wallposts: posts
    } = this.props

    return (
      <div id="UserProfile">
        <header>
          <ProfilePicture {...user.picture} />
          {authedUser._id && authedUser._id !== user._id && <ProfileOptions
            user={user}
            relationship={relationship}
            onQuery={onQuery}
          />}
          <div className="username">{user.username}</div>
          {user.title && <div className="title">{user.title}</div>}
          <div className="age">{user.location && user.location + ','} {user.gender} 20 år</div>
          <div className="description">{user.description}</div>
          <div>{'Joined ' + user.date}</div>
        </header>
        <Wall
          user={user}
          authedUser={authedUser}
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
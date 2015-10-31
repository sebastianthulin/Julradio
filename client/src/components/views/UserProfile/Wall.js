const React = require('react')
const { Link } = require('react-router')
const TimeSince = require('../../reusable/TimeSince')
const ProfilePicture = require('../../reusable/ProfilePicture')

class WallPost extends React.Component {
  shouldComponentUpdate() {
    return false
  }

  delete() {
    if (confirm('Ta bort inlägg?')) {
      this.props.onDelete(this.props._id)
    }
  }

  render() {
    const {
      from: user,
      text,
      date,
      removable
    } = this.props

    return (
      <div className="WallPost">
        <div className="author">
          <ProfilePicture {...user.picture} />
          <Link to={'/@' + user.username} className="user">{user.username}</Link>
          <TimeSince className="timeSince" date={date} />
        </div>
        <div className="text">{text}</div>
        {removable && <button className="delete" onClick={this.delete.bind(this)}>x</button>}
      </div>
    )
  }
}

class Wall extends React.Component {
  submitWallPost(ev) {
    ev.preventDefault()
    const text = this.refs.input.value.trim()
    this.refs.input.value = ''
    if (text) {
      this.props.onSubmit(text)
    }
  }

  renderForm() {
    if (this.props.relationship) {
      return this.props.relationship.isBlocked
        ? <h3>Du är blockad av denna användare</h3>
        : <h3>Du har blockat denna användare</h3>
    }

    return (
      <form onSubmit={this.submitWallPost.bind(this)}>
        <input type="text" ref="input" placeholder="Skriv ett inlägg i gästboken" />
      </form>
    )
  }

  render() {
    const {
      user,
      authedUser,
      posts,
      onDelete
    } = this.props

    return (
      <div id="Wall">
        {this.renderForm()}
        {posts && posts.map(post => <WallPost
          key={post._id}
          removable={authedUser._id === user._id || authedUser._id === post.from._id || authedUser.admin}
          onDelete={onDelete}
          {...post}
        />)}
      </div>
    )
  }
}

module.exports = Wall
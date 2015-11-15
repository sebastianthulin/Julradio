const React = require('react')
const { Link } = require('react-router')
const User = require('../../../services/User')
const ProfilePicture = require('../../reusable/ProfilePicture')
const TimeSince = require('../../reusable/TimeSince')
const Comments = require('../../reusable/Comments')
const ProfileOptions = require('./ProfileOptions')

const GENDERS = {
  MALE: 'Pojke',
  FEMALE: 'Flicka'
}

class UserProfile extends React.Component {
  componentWillMount() {
    this.authedUser = User.get() || {}
  }

  submitWallPost(ev) {
    ev.preventDefault()
    const text = this.refs.input.value.trim()
    const { user, onQuery } = this.props
    this.refs.input.value = ''
    if (text) {
      User.wallPost(user._id, text).then(() => {
        onQuery('wallposts')
      }).catch(err => {
        alert('något gick fel.', err)
      })
    }
  }

  commentRemovedHandler() {
    this.props.onQuery('wallposts')
  }

  renderForm() {
    if (this.props.relationship) {
      return this.props.relationship.isBlocked
        ? <h3>Du är blockad av denna användare</h3>
        : <h3>Du har blockat denna användare</h3>
    }

    return (
      <form onSubmit={this.submitWallPost.bind(this)}>
        <textarea className="profileComment" type="text" ref="input" placeholder="Skriv ett inlägg i gästboken (500 tecken högst)" />
        <button className="btn">Skicka</button>
      </form>
    )
  }

  getIndentity() {
    const { user } = this.props
    const genderName = GENDERS[user.gender]
    const location = user.location ? ', ' + user.location : ''
    if (genderName) {
      // ger P12 eller Pojke om ingen ålder
      return (user.age ? genderName[0] : genderName) + (user.age ? user.age : '') + location
    }
    if (user.age) {
      return user.age + ' år' + location
    }
    return user.location
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
          <ProfilePicture id={user.picture} />
          {authedUser._id && authedUser._id !== user._id && <ProfileOptions
            user={user}
            relationship={relationship}
            onQuery={onQuery}
          />}
          <div className="name">{user.name ? user.name : '@' + user.username}</div>
          <div className="identity">{user.name ? '@' + user.username : ''} {this.getIndentity()}</div>
          {user.title && <span className="title">{user.title}</span>}
          <div className="description">{user.description}</div>
          <div>Medlem i <TimeSince date={user.date} short={true} /></div>
        </header>
        <div className="wall">
          {this.renderForm()}
          {posts && <Comments comments={posts} onDelete={this.commentRemovedHandler.bind(this)} />}
        </div>
      </div>
    )
  }
}

module.exports = UserProfile
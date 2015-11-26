const React = require('react')
const { Link } = require('react-router')
const User = require('../../../services/User')
const history = require('../../../services/history')
const ProfilePicture = require('../../reusable/ProfilePicture')
const TimeSince = require('../../reusable/TimeSince')
const Comments = require('../../reusable/Comments')
const ProfileOptions = require('./ProfileOptions')

const GENDERS = {
  MALE: 'Pojke',
  FEMALE: 'Flicka'
}

class UserProfile extends React.Component {
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
    return user.location || ''
  }

  renderRelationship() {
    return this.props.block.isBlocked
      ? <h3>Du är blockad av denna användare</h3>
      : <h3>Du har blockat denna användare</h3>
  }

  handleClick(ev) {
    if (ev.target.tagName === 'A' && ev.metaKey === false) {
      ev.preventDefault()
      history.pushState(null, ev.target.pathname)
    }
  }

  render() {
    const {
      onQuery,
      user,
      authedUser,
      block: relationship,
      wallposts: posts
    } = this.props

    return (
      <div id="UserProfile">
        <header>
          <ProfilePicture id={user.picture} />
          <div className="name">{user.name ? user.name : '@' + user.username}</div>
          <div className="identity">{(user.name ? ('@' + user.username + ' ') : '') + this.getIndentity()}</div>
          {user.title && <span className="title">{user.title}</span>}
          <div
            className="description"
            onClick={this.handleClick.bind(this)}
            dangerouslySetInnerHTML={{__html: user.html}}
          />
          <div>Medlem i <TimeSince date={user.date} short={true} /></div>
        </header>
        <main>
          {authedUser && authedUser._id !== user._id && <ProfileOptions
            user={user}
            relationship={relationship}
            onQuery={onQuery}
          />}
          {relationship && this.renderRelationship()}
          <Comments
            type="user"
            target={user._id}
            placeholder="Skriv ett inlägg i gästboken"
            block={!!relationship}
          />
        </main>
      </div>
    )
  }
}

module.exports = UserProfile
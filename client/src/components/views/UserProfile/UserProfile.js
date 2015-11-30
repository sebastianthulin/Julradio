const React = require('react')
const { Link } = require('react-router')
const User = require('../../../services/User')
const ProfilePicture = require('../../reusable/ProfilePicture')
const TimeSince = require('../../reusable/TimeSince')
const Comments = require('../../reusable/Comments')
const MDMini = require('../../reusable/MDMini')
const ProfileOptions = require('./ProfileOptions')

class UserProfile extends React.Component {
  getIndentity() {
    const { user } = this.props
    const location = user.location ? ', ' + user.location : ''
    const genderName = {
      MALE: 'Pojke',
      FEMALE: 'Flicka'
    }[user.gender]

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
      ? <div className="blockage">Du är blockad av denna användare</div>
      : <div className="blockage">Du har blockat denna användare</div>
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
        <main>
          <ProfilePicture id={user.picture} />
          <div className="name">{user.name ? user.name : '@' + user.username}</div>
          <div className="misq">{(user.name ? ('@' + user.username + ' ') : '') + this.getIndentity()} </div>
          {user.title && <div className="title">{user.title}</div>}
          <div className="misq">Medlem i <TimeSince date={user.date} short={true} /></div>
        </main>
        {authedUser && authedUser._id !== user._id && <ProfileOptions
          user={user}
          relationship={relationship}
          onQuery={onQuery}
        />}
        {user.description && <MDMini className="description" text={user.description} />}
        {relationship && this.renderRelationship()}
        <Comments
          type="user"
          target={user._id}
          placeholder="Skriv ett inlägg i gästboken"
          block={!!relationship}
        />
      </div>
    )
  }
}

module.exports = UserProfile
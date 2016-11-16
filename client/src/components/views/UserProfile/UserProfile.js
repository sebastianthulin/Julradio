const React = require('react')
const {Link} = require('react-router')
const cx = require('classnames')
const ProfilePicture = require('../../reusable/ProfilePicture')
const TimeSince = require('../../reusable/TimeSince')
const Comments = require('../../reusable/Comments')
const MDMini = require('../../reusable/MDMini')
const ProfileOptions = require('./ProfileOptions')

class UserProfile extends React.Component {
  getIndentity() {
    const {user} = this.props
    const location = user.get('location') ? ', ' + user.get('location') : ''
    const genderName = {
      MALE: 'Pojke',
      FEMALE: 'Flicka'
    }[user.get('gender')]

    if (genderName) {
      // ger P12 eller Pojke om ingen ålder
      return (user.get('age') ? genderName[0] : genderName) + (user.get('age') ? user.get('age') : '') + location
    }
    if (user.get('age')) {
      return user.get('age') + ' år' + location
    }
    return user.get('location') || ''
  }

  renderRelationship() {
    return this.props.block.get('isBlocked')
      ? <div className="blockage">Du är blockad av denna användare</div>
      : <div className="blockage">Du har blockat denna användare</div>
  }

  render() {
    const {props} = this
    const {user, block, isOnline, showOptions} = props

    return (
      <div id="UserProfile">
        <main>
          <div className="picture">
            <ProfilePicture id={user.get('picture')} />
            <div className="status">
              <div className={cx('indi', {isOnline})} />
              <span>{isOnline ? '<-- är online :)' : '<-- är offline :('}</span>
            </div>
          </div>
          <div className="name">{user.get('name') ? user.get('name') : '@' + user.get('username')}</div>
          <div className="misq">{(user.get('name') ? ('@' + user.get('username') + ' ') : '') + this.getIndentity()} </div>
          {user.get('title') && <div className="title">{user.get('title')}</div>}
          <div className="misq">Medlem i <TimeSince date={user.get('date')} short={true} /></div>
        </main>
        {showOptions && <ProfileOptions
          user={user}
          block={block}
          onQuery={props.onQuery}
          onBlockUser={props.onBlockUser}
          onUnblockUser={props.onUnblockUser}
          isAdmin={props.isAdmin}
        />}
        {user.get('description') && <MDMini className="description" text={user.get('description')} />}
        {block && this.renderRelationship()}
        <Comments
          type="user"
          target={user.get('_id')}
          placeholder="Skriv ett inlägg i gästboken"
          block={!!block}
        />
      </div>
    )
  }
}

module.exports = UserProfile

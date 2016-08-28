const React = require('react')
const cx = require('classnames')
const {Link} = require('react-router')
const ProfilePicture = require('../../reusable/ProfilePicture')

const Conversation = ({id, user, lastMessage, selected, unseen}) => (
  <Link to={`/messages/${user.username}`} className={cx('Conversation', {selected, unseen})}>
    <ProfilePicture id={user.picture} />
    <div className={cx('username', {handle: !user.name})}>
      {user.name ? user.name : '@' + user.username}
      {user.name && <span className="handle">@{user.username}</span>}
    </div>
    {/* lastMessage && <p>{(user._id !== lastMessage.user ? 'Du: ' : '') + lastMessage.text}</p> */}
  </Link>
)

module.exports = Conversation

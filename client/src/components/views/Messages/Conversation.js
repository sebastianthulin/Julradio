const React = require('react')
const cx = require('classnames')
const { Link } = require('react-router')
const ProfilePicture = require('../../reusable/ProfilePicture')

const Conversation = ({ id, user, lastMessage, unread, selected, unseen }) => (
  <Link to={`/messages/${user.username}`} className={cx('conversation', { selected, unseen })}>
    {!user.picture && <div className="profile-picture" />}
    {user.picture && <ProfilePicture {...user.picture} />}
    <div className="username">{user.username}</div>
    {/* lastMessage && <p>{(user._id !== lastMessage.user ? 'Du: ' : '') + lastMessage.text}</p> */}
  </Link>
)

module.exports = Conversation
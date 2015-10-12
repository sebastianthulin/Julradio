const React = require('react')
const cx = require('classnames')
const { Link } = require('react-router')

const Conversation = ({ id, user, lastMessage, unread, selected }) => (
  <Link to={`/messages/${user.username}`} className={cx('conversation', { selected })}>
    {!user.picture && <div className="picture" />}
    {user.picture && <img className="picture" src={'/i/' + user.picture._id + user.picture.extension} />}
    <div className="username">{user.username}</div>
    {/* lastMessage && <p>{(user._id !== lastMessage.user ? 'Du: ' : '') + lastMessage.text}</p> */}
  </Link>
)

module.exports = Conversation
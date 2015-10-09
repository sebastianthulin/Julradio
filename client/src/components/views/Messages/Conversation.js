const React = require('react')
const { Link } = require('react-router')

const Conversation = ({ id, user, lastMessage, unread }) => (
  <Link to={`/messages/${id}`} className="friend">
    <div className="picture" />
    <div className="namn">{user.username}</div>
  </Link>
)

module.exports = Conversation
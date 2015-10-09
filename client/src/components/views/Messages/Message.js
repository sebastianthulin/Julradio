const React = require('react')

const Message = ({ message, user }) => (
  <div className="message">
    <div className={message.user.id === user.id ? 'right' : 'left'}>
      {message.text}
    </div>
  </div>
)

module.exports = Message
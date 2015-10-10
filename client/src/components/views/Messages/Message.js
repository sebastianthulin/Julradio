const React = require('react')
const cx = require('classnames')

const Message = ({ message, user }) => (
  <div className={cx('message', message.user === user._id ? 'right' : 'left')}>
    {message.text}
  </div>
)

module.exports = Message
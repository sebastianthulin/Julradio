const React = require('react')
const cx = require('classnames')

const Message = ({ message, right }) => (
  <div className={cx('message', right ? 'right' : 'left')}>
    {message.text}
  </div>
)

module.exports = Message
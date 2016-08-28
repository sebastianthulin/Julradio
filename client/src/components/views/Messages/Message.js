const React = require('react')
const cx = require('classnames')

class Message extends React.Component {
  shouldComponentUpdate() {
    return false
  }

  render() {
    const {message, right} = this.props
    return (
      <div className={cx('Message', right ? 'right' : 'left')}>
        {message.text}
      </div>
    )
  }
}

module.exports = Message

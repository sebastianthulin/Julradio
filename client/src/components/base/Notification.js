const React = require('react')
const errors = require('../../errors')
const ProfilePicture = require('../reusable/ProfilePicture')
const cx = require('classnames')

class Notification extends React.Component {
  componentDidMount() {
    const { onHeight } = this.props
    onHeight(this.refs.notification.clientHeight)
  }

  getMessage() {
    const { type, value, from } = this.props
    switch (type) {
      case 'settings': return 'Profilinställningar uppdaterade'
      case 'profilepicture': return 'Profilbild uppdaterad'
      case 'message': return 'Nytt meddelande från ' + from.username
      case 'requestsong': return 'Din önskning har skickats'
      default: return type
    }
  }

  getErrorMessage() {
    const { type, value } = this.props
    return errors[value] || errors.UNKNOWN_ERROR
  }

  render() {
    const { err, from, y } = this.props
    const style = {
      transform: `translateY(${y}px)`
    }

    return (
      <div ref="notification" className={cx('Notification', { err })} style={style}>
        {from && <ProfilePicture id={from.picture} />}
        {err ? this.getErrorMessage() : this.getMessage()}
      </div>
    )
  }
}

module.exports = Notification
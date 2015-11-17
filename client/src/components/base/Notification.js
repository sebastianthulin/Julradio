const React = require('react')
const { Link } = require('react-router')
const errors = require('../../errors')
const User = require('../../services/User')
const Sound = require('../../services/Sound')
const ProfilePicture = require('../reusable/ProfilePicture')
const cx = require('classnames')

class Notification extends React.Component {
  componentDidMount() {
    const { onHeight } = this.props
    onHeight(this.refs.notification.clientHeight)
    this.playSound()
  }

  playSound() {
    if (this.props.type === 'message') {
      Sound.play('bells')
    }
  }

  getMessage() {
    const { type, from } = this.props
    switch (type) {
      case 'message': return 'Nytt meddelande från ' + from.username
      case 'wallPost': return 'Gästbok inlägg från ' + from.username
      case 'settings': return 'Profilinställningar uppdaterade'
      case 'profilepicture': return 'Profilbild uppdaterad'
      case 'requestsong': return 'Din önskning har skickats'
      default: return type
    }
  }

  getErrorMessage() {
    const { value } = this.props
    return errors[value] || errors.UNKNOWN_ERROR
  }

  getURL() {
    const { type, from } = this.props
    switch (type) {
      case 'message': return '/messages/' + from.username
      case 'wallPost': return '/@' + User.get().username
    }
  }

  render() {
    const { err, from, y } = this.props
    const url = !err && this.getURL()
    const style = {
      transform: `translateY(${y}px)`
    }

    const notification = (
      <div ref="notification" className={cx('Notification', { err })} style={style}>
        {from && <ProfilePicture id={from.picture} />}
        {err ? this.getErrorMessage() : this.getMessage()}
      </div>
    )

    return url ? <Link to={url} children={notification} /> : notification
  }
}

module.exports = Notification
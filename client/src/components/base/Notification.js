const React = require('react')
const ProfilePicture = require('../reusable/ProfilePicture')
const cx = require('classnames')

const settings = {
  name: 'Namn',
  gender: 'Kön',
  location: 'Bor',
  description: 'Personlig beskrivning'
}

class Notification extends React.Component {
  getMessage() {
    const { type, value, err } = this.props
    switch (type) {
      case 'setting': return settings[value] + ' sparat'
      case 'profilepicture': return 'Profilbild uppdaterad'
      default: return type
    }
  }

  render() {
    const { err, from, y } = this.props
    const style = {
      transform: 'translateY(' + ~~y + 'px)'
    }
    return (
      <div style={style} className={cx('Notification', { err })}>
        <ProfilePicture id={from.picture}/>
        {this.getMessage()}
      </div>
    )
  }
}

module.exports = Notification
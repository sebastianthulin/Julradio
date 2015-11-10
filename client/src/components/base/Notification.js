const React = require('react')
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
    const { err } = this.props
    return (
      <div className={cx('Notification', { err })}>
        {this.getMessage()}
      </div>
    )
  }
}

module.exports = Notification
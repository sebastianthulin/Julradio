const React = require('react')

class Notification extends React.Component {
  render() {
    const { type, value, visible } = this.props
    return (
      <div className="Notification">
        {type}
      </div>
    )
  }
}

module.exports = Notification
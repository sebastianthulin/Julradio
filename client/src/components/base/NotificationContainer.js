const React = require('react')
const {connect} = require('react-redux')
const Notification = require('./Notification')
const {setNotificationHeight, clearNotification} = require('../../actions/notifications')

@connect(state => ({
  items: state.notifications.get('items')
}), {
  onSetNotificationHeight: setNotificationHeight,
  onClearNotification: clearNotification
})
class NotificationContainer extends React.Component {
  shouldComponentUpdate(props) {
    return props.items !== this.props.items
  }

  onHeight(notification, height) {
    this.props.onSetNotificationHeight(notification.get('id'), height)
  }

  render() {
    const {items, onClearNotification} = this.props
    let offsetTop = 0

    return (
      <div id="NotificationContainer" ref="container">
        {items.map(n => {
          const y = offsetTop
          offsetTop += n.get('height') + 10
          return <Notification
            key={n.get('id')}
            notification={n}
            y={n.get('height') ? y : -80}
            onHeight={height => this.onHeight(n, height)}
            onClearNotification={onClearNotification}
          />
        })}
      </div>
    )
  }
}

module.exports = NotificationContainer

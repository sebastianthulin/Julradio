const React = require('react')
const NotificationStore = require('../../stores/NotificationStore')
const Notification = require('./Notification')

const animationSpeed = .1
const notificationMargin = 10

class NotificationContainer extends React.Component {
  componentWillMount() {
    this.state = {
      list: []
    }
    NotificationStore.subscribe(list => this.setState({ list }))
  }

  onHeight(notification, height) {
    notification.height = height
    this.setPositions()
  }

  setPositions() {
    const { list } = this.state
    let offsetTop = 0
    for (let i = 0; i < list.length; i++) {
      list[i].y = offsetTop
      offsetTop += list[i].height + notificationMargin
    }
    this.setState({ list })
  }

  render() {
    const { list } = this.state
    return (
      <div id="NotificationContainer" ref="container">
        {list.map(n => <Notification onHeight={this.onHeight.bind(this, n)} {...n} />)}
      </div>
    )
  }
}

module.exports = NotificationContainer
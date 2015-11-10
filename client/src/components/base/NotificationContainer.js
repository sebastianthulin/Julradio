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
    NotificationStore.subscribe(this.handleList.bind(this))
  }

  handleList(list) {
    for(let i = 0; i < list.length; i++)
      list[i].targetY = i
    this.setState({ list })
    if (!list.length) 
      return
    !this.animationTick && this.animateNotifications()
    setTimeout(this.stopAnimation.bind(this), list.length * 5000)
  }

  onHeight(notification, height) {
    notification.y = -height
    notification.height = height
  }

  componentWillUnmount() {
    this.stopAnimation()
  }

  stopAnimation() {
    this.animationTick = cancelAnimationFrame(this.animationTick)
  }

  animateNotifications() {
    const { list } = this.state
    this.animationTick = requestAnimationFrame(this.animateNotifications.bind(this))
    for(let i = 0; i < list.length; i++) {
      const item = list[i]
      item.y += (item.targetY * (item.height + notificationMargin) - item.y) * animationSpeed // approach target destination
    }
    this.forceUpdate()
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
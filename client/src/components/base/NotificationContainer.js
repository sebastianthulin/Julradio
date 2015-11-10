const React = require('react')
const NotificationStore = require('../../stores/NotificationStore')
const Notification = require('./Notification')

const animationSpeed = .1

class NotificationContainer extends React.Component {
  componentWillMount() {
    this.state = {
      list: []
    }
    NotificationStore.subscribe(this.handleList.bind(this))
  }

  handleList(list) {
    list.map((list, index) => list.targetY = index * 80)
    this.setState({ list })
    if (!list.length) 
      return
    !this.animationTick && this.animateNotifications()
    setTimeout(this.stopAnimation.bind(this), list.length * 5000)
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
      item.y += (item.targetY - item.y) * animationSpeed // approach target destination
    }
    this.forceUpdate()
  }

  render() {
    const { list } = this.state
    return (
      <div id="NotificationContainer" ref="container">
        {list.map(n => <Notification {...n} />)}
      </div>
    )
  }
}

module.exports = NotificationContainer
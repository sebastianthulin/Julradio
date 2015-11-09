const React = require('react')
const NotificationStore = require('../../stores/NotificationStore')
const Notification = require('./Notification')

class NotificationContainer extends React.Component {
  componentWillMount() {
    NotificationStore.subscribe(list => this.setState({ list }))
  }

  render() {
    const { list } = this.state
    return (
      <div id="NotificationContainer">
        {list.map(n => <Notification {...n} />)}
      </div>
    )
  }
}

module.exports = NotificationContainer
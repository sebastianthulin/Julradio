const React = require('react')
const Messages = require('./Messages')
const ChatStore = require('../../../stores/ChatStore')

class MessagesContainer extends React.Component {
  componentWillMount() {
    this.state = {}
    ChatStore.onReady(() => this.setState({loaded: true}))
  }

  render() {
    const { loaded } = this.state
    return loaded ? <Messages {...this.props} /> : (
      <div>
        Loading...
      </div>
    )
  }
}

module.exports = MessagesContainer
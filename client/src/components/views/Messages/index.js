const React = require('react')
const Messages = require('./Messages')
const ChatStore = require('../../../stores/ChatStore')

class MessagesContainer extends React.Component {
  componentWillMount() {
    this.state = {}
    ChatStore.onReady(() => this.setState({loaded: true}))
  }

  render() {
    return this.state.loaded ? <Messages {...this.props} /> : (
      <div>
        Laddar...
      </div>
    )
  }
}

module.exports = MessagesContainer

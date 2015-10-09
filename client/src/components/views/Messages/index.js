const React = require('react')
const UserStore = require('../../../stores/UserStore')
const ChatStore = require('../../../stores/ChatStore')
const Message = require('./Message')
const Conversation = require('./Conversation')

class Messages extends React.Component {
  componentWillMount() {
    this.unsub = UserStore.subscribe(user => this.setState({user}))
    this.unsub2 = ChatStore.subscribe(state => this.setState(state))
    ChatStore.onReady(this.onReady.bind(this))
  }

  componentWillReceiveProps(props) {
    ChatStore.select(props.params.chatId)
  }

  componentWillUnmount() {
    this.unsub()
    this.unsub2()
  }

  onReady() {
    ChatStore.select(this.props.params.chatId)
  }

  sendMessage(ev) {
    ev.preventDefault()
    const chatId = this.state.selectedThreadId
    const input = this.refs.input
    input.value = input.value.trim()
    if (input.value && chatId) {
      ChatStore.sendMessage(input.value, chatId)
      input.value = ''
    }
  }

  render() {
    const { user, messages, threads } = this.state
    return (
      <div className="row content">
        <div className="profileBox">
          <div className="friends">
            {threads.map(thread => <Conversation key={thread.id} {...thread} />)}
          </div>
          <div className="chat">
            {messages.map(message => <Message key={message.id} user={user} message={message} />)}
            <form onSubmit={this.sendMessage.bind(this)}>
              <input type="text" ref="input" />
              <input type="submit" hidden />
            </form>
          </div>
        </div>
      </div>
    )
  }
}

module.exports = Messages
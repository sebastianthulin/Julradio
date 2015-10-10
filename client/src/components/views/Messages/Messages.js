const React = require('react')
const cx = require('classnames')
const ChatStore = require('../../../stores/ChatStore')
const UserStore = require('../../../stores/UserStore')
const Message = require('./Message')
const Conversation = require('./Conversation')

class Messages extends React.Component {
  componentWillMount() {
    this.unsub = ChatStore.subscribe(state => this.setState(state))
    ChatStore.select(this.props.params.user)
  }

  componentWillReceiveProps(props) {
    ChatStore.select(props.params.user)
  }

  componentWillUpdate() {
    const node = this.refs.messages
    this.doScroll = node && node.scrollHeight - node.clientHeight - node.scrollTop < 100
  }

  componentDidUpdate() {
    const node = this.refs.messages
    if (node && this.doScroll) {
      node.scrollTop = node.scrollHeight
    }
  }

  componentWillUnmount() {
    this.unsub()
  }

  sendMessage(ev) {
    ev.preventDefault()
    var text = this.refs.input.value.trim()
    if (text) {
      ChatStore.sendMessage(text)
    }
    this.refs.input.value = ''
  }

  renderWhatever() {
    return (
      <div>
        no convo selected
      </div>
    )
  }

  renderChat() {
    const { messages, targetUser } = this.state
    const user = UserStore.get()
    return (
      <div>
        <div className="user">
          {targetUser.username}
        </div>
        <div className="message-container" ref="messages">
          {messages.map(message => <Message key={message._id} user={user} message={message} />)}
        </div>
        <form onSubmit={this.sendMessage.bind(this)}>
          <input type="text" placeholder="Skriv ett meddelande..." ref="input" />
        </form>
      </div>
    )
  }

  render() {
    const { threads, selectedThreadId, targetUser } = this.state
    return (
      <div className="row content">
        <div className="messenger">
          <div className="conversations">
            {threads.map(thread => <Conversation key={thread._id} selected={selectedThreadId === thread._id} {...thread} />)}
          </div>
          <div className="chat">
            {targetUser && this.renderChat()}
            {!targetUser && this.renderWhatever()}
          </div>
        </div>
      </div>
    )
  }
}

module.exports = Messages
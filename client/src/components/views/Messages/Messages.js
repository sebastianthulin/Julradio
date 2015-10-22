const React = require('react')
const cx = require('classnames')
const { Link } = require('react-router')
const ChatStore = require('../../../stores/ChatStore')
const NotificationStore = require('../../../stores/NotificationStore')
const User = require('../../../services/User')
const Message = require('./Message')
const Conversation = require('./Conversation')

class Messages extends React.Component {
  componentWillMount() {
    this.unsub = ChatStore.subscribe(state => this.setState(state))
    ChatStore.select(this.props.params.user)
    NotificationStore.subscribe('message', unseen => this.setState({ unseen }))
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
      <div style={{padding: 20}}>
        Ingen konversation vald
      </div>
    )
  }

  renderChat() {
    const { messages, targetUser } = this.state
    const userId = User.get()._id
    return (
      <div>
        <div className="user">
          <Link to={`/@${targetUser.username}`}>{targetUser.username}</Link>
        </div>
        <div className="message-container" ref="messages">
          {messages.map(message => <Message key={message._id} right={userId === message.user} message={message} />)}
        </div>
        <form onSubmit={this.sendMessage.bind(this)}>
          <input type="text" placeholder="Skriv ett meddelande..." ref="input" />
        </form>
      </div>
    )
  }

  render() {
    const { threads, selectedThreadId, targetUser, unseen } = this.state
    const selected = ChatStore.getConversationId()
    return (
      <div id="messenger">
        <div className="conversations">
          {threads.map(thread => (
            <Conversation
              key={thread._id}
              selected={selected === thread._id}
              unseen={unseen.indexOf(thread._id) > -1}
              {...thread}
            />
          ))}
        </div>
        <div className="chat">
          {targetUser ? this.renderChat() : this.renderWhatever()}
        </div>
      </div>
    )
  }
}

module.exports = Messages
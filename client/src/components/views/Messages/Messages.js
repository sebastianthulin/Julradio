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

  componentDidMount() {
    this.scrollToBottom()
  }

  componentWillReceiveProps(props) {
    ChatStore.select(props.params.user)
  }

  componentWillUpdate(props) {
    if (this.props.params.user !== props.params.user) {
      this.doScroll = true
    } else {
      const node = this.refs.messages
      this.doScroll = node && node.scrollHeight - node.clientHeight - node.scrollTop < 100
    }
  }

  componentDidUpdate() {
    this.doScroll && this.scrollToBottom()
  }

  componentWillUnmount() {
    this.unsub()
    ChatStore.deselect()
  }

  scrollToBottom() {
    const node = this.refs.messages
    if (node) {
      node.scrollTop = node.scrollHeight
    }
  }

  sendMessage(ev) {
    ev.preventDefault()
    const text = this.refs.input.value.trim()
    if (text && text.length <= 200) {
      ChatStore.sendMessage(text)
    }
    this.refs.input.value = ''
  }

  loadMore() {
    ChatStore.load(this.props.params.user)
  }

  renderInitialScreen() {
    return (
      <div className="initial">
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
          <button onClick={this.loadMore.bind(this)}>More</button>
          {messages.map(message => <Message key={message._id} right={userId === message.user} message={message} />)}
        </div>
        <form onSubmit={this.sendMessage.bind(this)}>
          <input type="text" placeholder="Skriv ett meddelande..." ref="input" maxLength={200} />
        </form>
      </div>
    )
  }

  render() {
    const selected = ChatStore.getConversationId()
    const {
      threads,
      selectedThreadId,
      targetUser,
      unseen
    } = this.state

    return (
      <div id="Messages">
        <div className="conversation-list">
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
          {targetUser ? this.renderChat() : this.renderInitialScreen()}
        </div>
      </div>
    )
  }
}

module.exports = Messages
const React = require('react')
const {Link} = require('react-router')
const cx = require('classnames')

class Message extends React.Component {
  shouldComponentUpdate() {
    return false
  }

  render() {
    const {message, right} = this.props
    return (
      <div className={cx('Message', right ? 'right' : 'left')}>
        {message.get('text')}
      </div>
    )
  }
}

class Messages extends React.Component {
  shouldComponentUpdate(props) {
    return props.messages !== this.props.messages
  }

  componentWillMount() {
    this.handleFocus = () => this.onAction({})
    this.handleScroll = this.handleScroll.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
    window.addEventListener('focus', this.handleFocus)
  }

  componentDidMount() {
    this.onAction({initialLoad: true, allowScroll: true})
  }

  componentDidUpdate(prevProps) {
    const prevSize = prevProps.messages ? prevProps.messages.size : 0
    const receivedMessage = prevSize !== this.props.messages.size
    const initialLoad = receivedMessage && prevSize === 0
    if (receivedMessage) {
      this.onAction({initialLoad, allowScroll: true})
    }
  }

  componentWillUnmount() {
    window.removeEventListener('focus', this.handleFocus)
  }

  onAction({initialLoad, allowScroll}) {
    const msgNode = this.refs.messages
    const mayScroll = msgNode && (initialLoad || msgNode.scrollHeight - msgNode.clientHeight - msgNode.scrollTop < 100)
    const doScroll = mayScroll && allowScroll
    const isSeen = mayScroll && document.hasFocus()

    // Scroll to bottom
    if (doScroll) {
      msgNode.scrollTop = msgNode.scrollHeight
    }

    if (isSeen) {
      this.props.onRead()
    }
  }

  handleScroll({target}) {
    if (target.scrollTop === 0) {
      const prevScrollHeight = target.scrollHeight
      this.props.fetchMessages().then(() => {
        const growth = target.scrollHeight - prevScrollHeight
        target.scrollTop += growth
      })
    }
  }

  sendMessage(evt) {
    const text = this.refs.input.value.trim()
    evt.preventDefault()
    this.refs.input.value = ''
    if (text) {
      this.props.sendMessage(text)
    }
  }

  render() {
    return (
      <div className="Messages">
        {this.props.user ? this.renderChat() : this.renderInitialScreen()}
      </div>
    )
  }

  renderInitialScreen() {
    return (
      <div className="initial">
        <div className="chatWelcome">
          <h1>Julchatten</h1>
          <p>Påbörja en konversation genom att gå in på någons profil och tryck på "skicka meddelande".</p>
        </div>
      </div>
    )
  }

  renderChat() {
    const {ownUserId, user, messages} = this.props

    return (
      <div>
        <div className="user">
          <Link to={`/@${user.get('username')}`}>
            {user.get('name') ? user.get('name') : user.get('username')}
          </Link>
        </div>
        <div className="messageContainer" ref="messages" onScroll={this.handleScroll}>
          {messages && messages && messages.map(message => (
            <Message
              key={message.get('_id')}
              right={ownUserId === message.get('user')}
              message={message}
            />
          ))}
        </div>
        <form onSubmit={this.sendMessage}>
          <input type="text" placeholder="Skriv ett meddelande..." ref="input" maxLength={200} />
        </form>
      </div>
    )
  }
}

module.exports = Messages

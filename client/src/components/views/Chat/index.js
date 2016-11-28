const React = require('react')
const {connect} = require('react-redux')
const ConversationList = require('./ConversationList')
const Messages = require('./Messages')
const {fetchConversations, selectUserConversation, deselectUserConversation, fetchMessages, sendMessage} = require('../../../actions/chat')
const {pullUnseenCount} = require('../../../actions/notifications')
const selectors = require('../../../selectors')

@connect(state => ({
  ownUserId: selectors.userId(state),
  selectedUser: selectors.selectedUser(state),
  conversationId: selectors.conversationId(state),
  conversations: selectors.conversationList(state),
  messages: selectors.conversationMessages(state),
  unseenConversationIds: selectors.unseenCount(state, 'message')
}), {
  fetchConversations,
  selectUserConversation,
  deselectUserConversation,
  fetchMessages,
  sendMessage,
  pullUnseenCount
})
class Chat extends React.Component {
  componentWillMount() {
    this.props.fetchConversations().then(() => {
      this.props.selectUserConversation(this.props.params.user)
    })
  }

  componentWillReceiveProps(props) {
    if (props.params.user !== this.props.params.user) {
      this.props.selectUserConversation(props.params.user)
    }
  }

  componentWillUnmount() {
    this.props.deselectUserConversation()
  }

  render() {
    const {props} = this
    const {conversationId} = props

    return (
      <div id="Chat">
        <ConversationList
          conversations={props.conversations}
          selectedConversationId={props.conversationId}
          unseenConversationIds={props.unseenConversationIds}
        />
        <Messages
          key={props.selectedUser && props.selectedUser.get('_id')}
          ownUserId={props.ownUserId}
          user={props.selectedUser}
          messages={props.messages}
          fetchMessages={props.fetchMessages}
          sendMessage={props.sendMessage}
          onRead={() => {
            if (props.unseenConversationIds.indexOf(conversationId) > -1) {
              props.pullUnseenCount('message', conversationId)
            }
          }}
        />
      </div>
    )
  }
}

module.exports = Chat

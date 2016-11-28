const React = require('react')
const {Link} = require('react-router')
const cx = require('classnames')
const ProfilePicture = require('../../reusable/ProfilePicture')

const Conversation = ({conversation, isSelected, isUnseen}) => {
  const user = conversation.get('user')
  const lastMessage = conversation.get('lastMessage')
  return (
    <Link to={`/messages/${user.get('username')}`} className={cx('Conversation', {isSelected, isUnseen})}>
      <ProfilePicture id={user.get('picture')} />
      <div className={cx('username', {handle: !user.get('name')})}>
        {user.get('name') ? user.get('name') : '@' + user.get('username')}
        {user.get('name') && <span className="handle">@{user.get('username')}</span>}
      </div>
      {/* lastMessage && <p>{(user.get('_id') !== lastMessage.get('user') ? 'Du: ' : '') + lastMessage.get('text')}</p> */}
    </Link>
  )
}

const ConversationList = ({conversations, selectedConversationId, unseenConversationIds}) => (
  <div className="ConversationList">
    {conversations.map(conv => (
      <Conversation
        key={conv.get('id')}
        isSelected={selectedConversationId === conv.get('id')}
        isUnseen={unseenConversationIds.indexOf(conv.get('id')) > -1}
        conversation={conv}
      />
    ))}
  </div>
)

module.exports = ConversationList

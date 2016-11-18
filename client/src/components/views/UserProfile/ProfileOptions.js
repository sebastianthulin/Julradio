const React = require('react')
const {Link} = require('react-router')

const ProfileOptions = ({user, block, isAdmin, onBlockUser, onUnblockUser, onQuery}) => {
  const runQuery = err => !err && onQuery('block')
  const onBlock = () => onBlockUser(user.get('_id')).then(runQuery)
  const onUnBlock = () => onUnblockUser(user.get('_id')).then(runQuery)

  return (
    <div className="ProfileOptions">
      <Link to={`/messages/${user.get('username')}`} className="action">Skicka Meddelande</Link>
      {!block || !block.get('hasBlocked')
        ? <div onClick={onBlock} className="action">Blocka</div>
        : <div onClick={onUnBlock} className="action">Avblockera</div>}
      {isAdmin && <Link to={`/admin/users/${user.get('username')}`} className="action">Hantera användare</Link>}
    </div>
  )
}

module.exports = ProfileOptions

const React = require('react')
const {Link} = require('react-router')

class ProfileOptions extends React.Component {
  onBlock() {
    this.props.onBlockUser(this.props.user.get('_id')).then(() => {
      this.props.onQuery('block')
    })
  }

  onUnBlock() {
    this.props.onUnblockUser(this.props.user.get('_id')).then(() => {
      this.props.onQuery('block')
    })
  }

  render() {
    const {user, block, isAdmin} = this.props
    return (
      <div className="ProfileOptions">
        <Link to={`/messages/${user.get('username')}`} className="action">Skicka Meddelande</Link>
        {!block || !block.get('hasBlocked')
          ? <div onClick={this.onBlock.bind(this)} className="action">Blocka</div>
          : <div onClick={this.onUnBlock.bind(this)} className="action">Avblockera</div>}
        {isAdmin && <Link to={`/admin/users/${user.get('username')}`} className="action">Hantera användare</Link>}
      </div>
    )
  }
}

module.exports = ProfileOptions

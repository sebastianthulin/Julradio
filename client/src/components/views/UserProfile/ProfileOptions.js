const React = require('react')
const {Link} = require('react-router')
const User = require('../../../services/User')

class ProfileOptions extends React.Component {
  onBlock() {
    User.block(this.props.user.get('_id'), () => {
      this.props.onQuery('block')
    })
  }

  onUnBlock() {
    User.unBlock(this.props.user.get('_id'), () => {
      this.props.onQuery('block')
    })
  }

  render() {
    const {user, block} = this.props
    return (
      <div className="ProfileOptions">
        <Link to={`/messages/${user.get('username')}`} className="action">Skicka Meddelande</Link>
        {!block || !block.get('hasBlocked')
          ? <div onClick={this.onBlock.bind(this)} className="action">Blocka</div>
          : <div onClick={this.onUnBlock.bind(this)} className="action">Avblockera</div>}
        {User.isAdmin() && <Link to={`/admin/users/${user.get('username')}`} className="action">Hantera användare</Link>}
      </div>
    )
  }
}

module.exports = ProfileOptions

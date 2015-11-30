const React = require('react')
const { Link } = require('react-router')
const User = require('../../../services/User')

class ProfileOptions extends React.Component {
  onBlock() {
    User.block(this.props.user._id, () => {
      this.props.onQuery('block')
    })
  }

  onUnBlock() {
    User.unBlock(this.props.user._id, () => {
      this.props.onQuery('block')
    })
  }

  render() {
    const { user, relationship } = this.props
    return (
      <div className="ProfileOptions">
        <Link to={`/messages/${user.username}`} className="action">Skicka Meddelande</Link>
        {!relationship || !relationship.hasBlocked
          ? <div onClick={this.onBlock.bind(this)} className="action">Blocka</div>
          : <div onClick={this.onUnBlock.bind(this)} className="action">Avblockera</div>}
        {User.isAdmin() && <Link to={`/admin/users/${user.username}`} className="action">Hantera användare</Link>}
      </div>
    )
  }
}

module.exports = ProfileOptions
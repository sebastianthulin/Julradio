const React = require('react')
const { Link } = require('react-router')

class ProfileOptions extends React.Component {
  onBlock() {
    const { user, getRelationship } = this.props
    User.block(user._id, getRelationship)
  }

  onUnBlock() {
    const { user, getRelationship } = this.props
    User.unBlock(user._id, getRelationship)
  }

  render() {
    const { user, relationship } = this.props
    return (
      <div id="ProfileOptions">
        <Link to={`/messages/${user.username}`} className="action">Skicka Meddelande</Link>
        {!relationship || !relationship.hasBlocked
          ? <div onClick={this.onBlock.bind(this)} className="action">Blocka</div>
          : <div onClick={this.onUnBlock.bind(this)} className="action">Avblockera</div>}
      </div>
    )
  }
}

module.exports = ProfileOptions
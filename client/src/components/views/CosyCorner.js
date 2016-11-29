const React = require('react')
const {connect} = require('react-redux')
const {Link} = require('react-router')
const Comments = require('../reusable/Comments')
const ProfilePicture = require('../reusable/ProfilePicture')

const User = ({user}) => (
  <Link to={'/@' + user.get('username')} className="User">
    <ProfilePicture id={user.get('picture')} />
    <span className="username">{user.get('username')}</span>
  </Link>
)

@connect(state => ({
  onlineList: state.users.get('onlineList')
}))
class CosyCorner extends React.Component {
  render() {
    return (
      <div id="CosyCorner">
        <div className="cosyCornerInner">
          <h1>Myshörnan</h1>
          <Comments
            type="cosyCorner"
            target={true}
            placeholder="Skriv något i myshörnan"
            signInPlaceholder="Logga in för att ta del av myset"
          />
        </div>
        <div className="onlineList">
          <h1>Online</h1>
          <div className="list">
            <Link to="/search" className="search">
              <div className="inner">
                <img src="/images/search.svg" />
              </div>
              <span className="searchText">Sök användare</span>
            </Link>
            {this.props.onlineList.map(user =>
              <User key={user.get('_id')} user={user} />
            )}
          </div>
        </div>
      </div>
    )
  }
}

module.exports = CosyCorner

const React = require('react')
const {Link} = require('react-router')
const {connect} = require('react-redux')
const ProfilePicture = require('../reusable/ProfilePicture')
const {searchUsers} = require('../../actions/users')

const User = ({user}) => (
  <Link to={'/@' + user.get('username')} className="User">
    <ProfilePicture id={user.get('picture')} />
    <span>{user.get('username')}</span>
  </Link>
)

@connect(state => ({
  searchQuery: state.users.getIn(['search', 'query']),
  searchResult: state.users.getIn(['search', 'users'])
}), {
  onSearchUsers: searchUsers
})
class UserSearch extends React.Component {
  render() {
    const {searchQuery, searchResult, onSearchUsers} = this.props

    return (
      <div id="UserSearch">
        <input
          value={searchQuery}
          placeholder="Sök medlemmar"
          onChange={evt => onSearchUsers(evt.target.value)}
        />
        {searchResult && searchResult.map(user =>
          <User key={user.get('_id')} user={user} />
        )}
      </div>
    )
  }
}

module.exports = UserSearch

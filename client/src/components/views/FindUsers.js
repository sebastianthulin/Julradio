const React = require('react')
const {Link} = require('react-router')
const {connect} = require('react-redux')
const ProfilePicture = require('../reusable/ProfilePicture')
const {searchUsers} = require('../../actions/search')

const User = ({user}) => (
  <div className="User">
    <ProfilePicture id={user.get('picture')} />
    <Link to={'/@' + user.get('username')}>{user.get('username')}</Link>
  </div>
)

@connect(state => ({
  onlineList: state.onlineList,
  searchQuery: state.search.get('query'),
  searchResult: state.search.get('users')
}), {
  onSearchUsers: searchUsers
})
class FindUsers extends React.Component {
  render() {
    const {onlineList, searchQuery, searchResult, onSearchUsers} = this.props
    const mapUsers = user => <User key={user.get('_id')} user={user} />
    return (
      <div id="FindUsers">
        Online:
        {onlineList.map(mapUsers)}
        <input
          value={searchQuery}
          placeholder="Sök..."
          onChange={evt => onSearchUsers(evt.target.value)}
        />
        {searchResult && searchResult.map(mapUsers)}
      </div>
    )
  }
}

module.exports = FindUsers

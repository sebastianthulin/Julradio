const React = require('react')
const {connect} = require('react-redux')
const {Link} = require('react-router')
const ProfilePicture = require('../reusable/ProfilePicture')
const MDMini = require('../reusable/MDMini')
const {fetchCrew} = require('../../actions/users')

const CrewMember = ({user}) => (
  <div className="CrewMember">
    <header>
      <ProfilePicture id={user.get('picture')} />
      <div className="meta">
        <div className="name">{user.get('name')}</div>
        {user.get('title') && <div className="title">{user.get('title')}</div>}
        <div className="username">
          <Link to={`/@${user.get('username')}`}>
            @{user.get('username')}
          </Link>
        </div>
      </div>
    </header>
    <MDMini text={user.get('description')} />
  </div>
)

@connect(state => ({
  crew: state.users.get('crew')
}), {
  onFetchCrew: fetchCrew
})
class Crew extends React.Component {
  componentWillMount() {
    this.props.onFetchCrew()
  }

  render() {
    return (
      <div id="Crew">
        {this.props.crew.map(user =>
          <CrewMember key={user.get('username')} user={user} />
        )}
      </div>
    )
  }
}

module.exports = Crew

const React = require('react')
const { Link } = require('react-router')
const UserStore = require('../../stores/UserStore')
const ProfilePicture = require('../reusable/ProfilePicture')

const Member = ({ id, username, realname, title, description, picture }) => (
  <div className="crew-member">
    <header>
      {picture && <ProfilePicture {...picture} />}
      <div className="meta">
        <div className="realname">{realname}</div>
        {title && <div className="title">{title}</div>}
        <div className="username"><Link to={`/@${username}`}>@{username}</Link></div>
      </div>
    </header>
    <p>{description}</p>
  </div>
)

class Crew extends React.Component {
  componentWillMount() {
    this.state = {crew: []}
    UserStore.getCrew(crew => this.setState({ crew }))
  }

  render() {
    const { crew } = this.state
    return (
      <div id="crew">
        {crew.map(user => <Member key={user.username} {...user} />)}
      </div>
    )
  }}

module.exports = Crew
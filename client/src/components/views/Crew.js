const React = require('react')
const { Link } = require('react-router')
const UserStore = require('../../stores/UserStore')

const Member = ({ id, username, realname, title, description, picture }) => (
  <div>
    {picture && <img src={'/i/' + picture._id + picture.extension} width="100" />}
    <h3>{realname} (<Link to={`/@${username}`}>@{username}</Link>) ({title})</h3>
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
      <div className="row">
        {crew.map(user => <Member key={user._id} {...user} />)}
      </div>
    )
  }
}

module.exports = Crew
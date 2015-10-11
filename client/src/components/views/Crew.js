const React = require('react')
const request = require('superagent')

const Member = ({ id, username, realname, title, description }) => (
  <div>
    <h3>{realname} ({username}) ({title})</h3>
    <p>{description}</p>
  </div>
)

class Crew extends React.Component {
  componentWillMount() {
    this.state = {crew: []}
    request.get('/api/crew').then(({ body: crew }) => this.setState({ crew }))
  }

  render() {
    const { crew } = this.state
    return (
      <div className="row content">
        {crew.map(member => <Member key={member.id} {...member} />)}
      </div>
    )
  }
}

module.exports = Crew
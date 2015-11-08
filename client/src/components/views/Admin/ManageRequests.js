const React = require('react')
const RequestStore = require('../../../stores/RequestStore')

const Request = ({ name, song, text }) => (
  <div className="Request">
    <div className="name">{name}</div>
    <div className="song">{song}</div>
    <div className="text">{text}</div>
    <button>Accept</button>
    <button>Deny</button>
  </div>
)

class ManageRequests extends React.Component {
  componentWillMount() {
    this.state = {
      requests: []
    }
    this.refresh()
  }

  refresh(requests) {
    RequestStore.getRequests().then(({ body: requests }) => this.setState({ requests }))
  }

  render() {
    const { requests } = this.state
    return (
      <div>
        <button onClick={this.refresh.bind(this)}>Refresh</button>
        {requests.map(request => <Request key={request._id} {...request} />)}
      </div>
    )
  }
}

module.exports = ManageRequests
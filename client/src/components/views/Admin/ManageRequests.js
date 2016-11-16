const React = require('react')
const {connect} = require('react-redux')
const {fetchRequests, acceptRequest, denyRequest, wipeRequests} = require('../../../actions/requests')
const TimeSince = require('../../reusable/TimeSince')

class Request extends React.Component {
  render() {
    const {request, onAccept, onDeny} = this.props
    const accept = () => onAccept(request._id).then(() => this.setState({accepted: true}))
    const deny = () => onDeny(request._id).then(() => this.setState({removed: true}))
    const {accepted, removed} = this.state || {}
    return (
      <div className="SongRequest">
        <div className="name">{request.name}</div>
        <div className="song">{request.song}</div>
        <div className="text">{request.text}</div>
        <span className="iptime"><TimeSince date={request.date} /> {request.ip}</span>
        {accepted ? (
          <div className="message">
            Accepterad
          </div>
        ) : removed ? (
          <div className="message">
            Borttagen
          </div>
        ) : (
          <div className="actions">
            <button onClick={accept} children="Accept" />
            <button onClick={deny} children="Ta bort" />
          </div>
        )}
      </div>
    )
  }
}

@connect(null, {
  fetchRequests, acceptRequest, denyRequest, wipeRequests
})
class ManageRequests extends React.Component {
  componentWillMount() {
    this.state = {requests: []}
    this.refresh()
  }

  refresh(requests) {
    this.props.fetchRequests().then(requests => {
      this.setState({requests})
    })
  }

  wipe() {
    if (confirm('Vill du ta bort alla önskningar?')) {
      this.props.wipeRequests().then(() => this.refresh())
    }
  }

  render() {
    const {requests} = this.state
    return (
      <div>
        <button className="btn" onClick={this.refresh.bind(this)}>Refresh</button>
        <button className="btn" onClick={this.wipe.bind(this)}>Ta bort alla</button>
        <div className="requestContainer">
          {requests.map(request => (
            <Request
              key={request._id}
              request={request}
              onAccept={this.props.acceptRequest}
              onDeny={this.props.denyRequest}
            />)
          )}
        </div>
      </div>
    )
  }
}

module.exports = ManageRequests

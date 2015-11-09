const React = require('react')
const RequestStore = require('../../../stores/RequestStore')

class Request extends React.Component {
  accept() {
    const {_id, refresh} = this.props
    RequestStore.accept(_id).then(() => refresh())
  }

  deny() {
    const {_id, refresh} = this.props
    RequestStore.deny(_id).then(() => refresh())
  }

  render() {
    const {name, song, text} = this.props
    return (
      <div className="Request">
        <div className="name">{name}</div>
        <div className="song">{song}</div>
        <div className="text">{text}</div>
        <div className="actions">
          <button onClick={this.accept.bind(this)} children="Accept" />
          <button onClick={this.deny.bind(this)} children="Deny" />
        </div>
      </div>
    )
  }
}

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
        <button className="btn" onClick={this.refresh.bind(this)}>Refresh</button>
        <div className="requestContainer">
          {requests.map(request => <Request key={request._id} {...request} />)}
        </div>
      </div>
    )
  }
}

module.exports = ManageRequests
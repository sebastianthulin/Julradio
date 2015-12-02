const React = require('react')
const RequestStore = require('../../../stores/RequestStore')
const TimeSince = require('../../reusable/TimeSince')

class Request extends React.Component {
  accept() {
    RequestStore.accept(this.props._id, () => this.setState({accepted: true}))
  }

  deny() {
    RequestStore.deny(this.props._id, () => this.setState({removed: true}))
  }

  render() {
    const { name, song, text, date } = this.props
    const { accepted, removed } = this.state || {}
    return (
      <div className="SongRequest">
        <div className="name">{name}</div>
        <div className="song">{song}</div>
        <div className="text">{text}</div>
        <TimeSince date={date} />
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
            <button onClick={this.accept.bind(this)} children="Accept" />
            <button onClick={this.deny.bind(this)} children="Ta bort" />
          </div>
        )}
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
    RequestStore.fetch(requests => this.setState({ requests }))
  }

  wipe() {
    if (confirm('Vill du ta bort alla önskningar?')) {
      RequestStore.wipe(this.refresh.bind(this))
    }
  }

  render() {
    const { requests } = this.state
    return (
      <div>
        <button className="btn" onClick={this.refresh.bind(this)}>Refresh</button>
        <button className="btn" onClick={this.wipe.bind(this)}>Ta bort alla</button>
        <div className="requestContainer">
          {requests.map(request => <Request key={request._id} {...request} />)}
        </div>
      </div>
    )
  }
}

module.exports = ManageRequests
const React = require('react')
const User = require('../../../services/User')
const RequestStore = require('../../../stores/RequestStore')

class Request extends React.Component {
  componentWillMount() {
    this.state = {}
  }

  shouldComponentUpdate(props, state) {
    return this.state.removed !== state.removed
  }

  delete() {
    if (confirm('Ta bort tweet?')) {
      RequestStore.deleteTweet(this.props.request._id).then(() => {
        this.setState({removed: true})
      })
    }
  }

  render() {
    const { request, removable } = this.props
    const { removed } = this.state
    return removed ? (
      <div className="Request">
        Borttagen.
      </div>
    ) : request.tweet ? (
      <div className="Request">
        <img src={request.userImage} />
        <a className="user" href={'http://twitter.com/' + request.username} target="_blank">{request.username}</a>
        <p className="text">{request.text}</p>
        {removable && <div className="remove" onClick={this.delete.bind(this)}>x</div>}
      </div>
    ) : (
      <div className="Request">
        <span className="user">{request.name}</span>
        <p className="text">{request.text}</p>
        <div className="song">{request.song}</div>
      </div>
    )
  }
}

class Feed extends React.Component {
  componentWillMount() {
    this.admin = User.isAdmin()
    this.unsubscribe = RequestStore.subscribe(requests => this.setState({ requests }))
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  render() {
    const { requests } = this.state
    return (
      <div className="Feed">
        {requests.map(request => <Request
          key={request._id}
          request={request}
          removable={this.admin}
        />)}
      </div>
    )
  }
}

module.exports = Feed
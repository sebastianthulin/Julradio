const React = require('react')
const {connect} = require('react-redux')
const {deleteRequest, deleteTweet} = require('../../../actions/requests')
const User = require('../../../services/User')

class Request extends React.Component {
  shouldComponentUpdate(props) {
    return this.props.request !== props.request
  }

  delete() {
    const {request, remove} = this.props
    if (confirm(`Ta bort ${request.get('tweet') ? 'tweet' : 'önskning'}?`)) {
      remove(request.get('_id'))
    }
  }

  render() {
    const {request, removable} = this.props
    return request.get('deleted') ? (
      <div className="Request">
        Borttagen.
      </div>
    ) : request.get('tweet') ? (
      <div className="Request">
        <img src={request.get('userImage')} />
        <a className="user" href={'http://twitter.com/' + request.get('username')} target="_blank">{request.get('username')}</a>
        <p className="text">{request.get('text')}</p>
        {removable && <div className="remove" onClick={this.delete.bind(this)}>x</div>}
      </div>
    ) : (
      <div className="Request">
        <span className="user">{request.get('name')}</span>
        <p className="text">{request.get('text')}</p>
        <div className="song">{request.get('song')}</div>
        {removable && <div className="remove" onClick={this.delete.bind(this)}>x</div>}
      </div>
    )
  }
}

@connect(state => ({
  requests: state.requests
}), {
  deleteRequest,
  deleteTweet
})
class Feed extends React.Component {
  componentWillMount() {
    this.admin = User.isAdmin()
  }

  render() {
    const {requests, deleteRequest, deleteTweet} = this.props
    return (
      <div className="Feed">
        {requests.map(request => <Request
          key={request.get('_id')}
          request={request}
          removable={this.admin}
          remove={request.get('tweet') ? deleteTweet : deleteRequest}
        />)}
      </div>
    )
  }
}

module.exports = Feed

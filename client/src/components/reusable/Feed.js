const React = require('react')

class Tweet extends React.Component {
  shouldComponentUpdate() {
    return false
  }

  render() {
    const { tweet } = this.props
    return (
      <div className="Tweet">
        <img src={tweet.userimage} />
        <a target="_blank" href={'http://twitter.com/' + tweet.username}>{tweet.username}</a>
        <p className="text">{tweet.text}</p>
      </div>
    )
  }
}

class Feed extends React.Component {
  render() {
    const { tweets } = this.props
    return (
      <div className="Feed">
        {tweets.map(tweet => <Tweet key={tweet.id} tweet={tweet} />)}
      </div>
    )
  }
}

module.exports = Feed
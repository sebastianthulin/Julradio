var React = require('react')

class Tweet extends React.Component {
  render() {
    var { tweet } = this.props
    return (
      <div className="tweet">
        <img src={tweet.userimage} />
        <a target="_blank" href={'http://twitter.com/' + tweet.username}>{tweet.username}</a>
        <p className="text">{tweet.text}</p>
      </div>
    )
  }
}

class TwitterFeed extends React.Component {
  render() {
    return (
      <div className="tweets">
        {this.props.tweets.map(tweet => <Tweet key={tweet.id} tweet={tweet} />)}
      </div>
    )
  }
}

module.exports = TwitterFeed
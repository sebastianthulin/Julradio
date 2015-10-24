const React = require('react')

class Tweet extends React.Component {
  shouldComponentUpdate() {
    return false
  }

  render() {
    const { tweet } = this.props
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
    const { tweets } = this.props
    return (
      <div className="tweets">
        {tweets.map(tweet => <Tweet key={tweet.id} tweet={tweet} />)}
      </div>
    )
  }
}

module.exports = TwitterFeed
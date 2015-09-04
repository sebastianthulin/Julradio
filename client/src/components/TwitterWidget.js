var React = require('react')
var TweetStore = require('../stores/TweetStore')

class Tweet extends React.Component {
  render() {
    var { tweet } = this.props
    return (
      <div>{tweet.text}</div>
    )
  }
}

class TwitterWidget extends React.Component {
  componentWillMount() {
    this.unsubscribe = TweetStore.subscribe(this.handleTweets.bind(this))
  }

  handleTweets(tweets) {
    this.setState({tweets})
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  render() {
    return (
      <div>
        {this.state.tweets.map(tweet => <Tweet key={tweet.id} tweet={tweet} />)}
      </div>
    )
  }
}

module.exports = TwitterWidget
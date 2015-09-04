var React = require('react')
var TweetStore = require('../stores/TweetStore')

class Tweet extends React.Component {
  render() {
    var { tweet } = this.props
    console.log(tweet);
    return (
      <div className="tweetBox">
        <img className="profileImg" src={tweet.user.profile_image_url} />
        <a target="_blank" href={'http://twitter.com/' + tweet.user.screen_name}><span className="user">{tweet.user.screen_name}</span></a>
        <span className="text">{tweet.text}</span>
      </div>
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
        <span className="hashtagJulradio">#julradio</span>
        {this.state.tweets.map(tweet => <Tweet key={tweet.id} tweet={tweet} />)}
      </div>
    )
  }
}

module.exports = TwitterWidget
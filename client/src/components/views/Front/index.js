var React = require('react')
var Modal = require('../../../services/Modal')
var TweetStore = require('../../../stores/TweetStore')
var NewsStore = require('../../../stores/NewsStore')
var Article = require('./Article')
var TwitterFeed = require('../../reusable/TwitterFeed')

class Front extends React.Component {
  componentWillMount() {
    NewsStore.get(this.handleArticles.bind(this))
    this.unsubscribe = TweetStore.subscribe(this.handleTweets.bind(this))
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  handleArticles(articles) {
    this.setState({articles})
  }

  handleTweets(tweets) {
    this.setState({tweets})
  }

  render() {
    var { articles, tweets } = this.state
    return (
      <div id="front" className="row content">
        <div className="two-thirds column">
          <h1>Blogg</h1>
          {articles.map(article => <Article key={article._id} article={article} />)}
        </div>
        <div className="one-third column">
          {tweets.length > 0 && <span className="hashtagJulradio">#julradio</span>}
          <div className="compose" onClick={Modal.open.bind(null, 'RequestSong')}>
            Skriv en önskning...
          </div>
          <TwitterFeed tweets={tweets} />
        </div>
      </div>
    )
  }
}

module.exports = Front
var React = require('react')
var Modal = require('../../../services/Modal')
var TweetStore = require('../../../stores/TweetStore')
var ArticleStore = require('../../../stores/ArticleStore')
var TwitterFeed = require('../../reusable/TwitterFeed')
var Article = require('./Article')

class Front extends React.Component {
  componentWillMount() {
    ArticleStore.getSchedule(schedule => this.setState({ schedule }))
    ArticleStore.get(articles => this.setState({articles}))
    this.unsubscribe = TweetStore.subscribe(tweets => this.setState({tweets}))
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  render() {
    var { articles, schedule, tweets } = this.state
    return (
      <div id="front" className="row content">
        <div className="two-thirds column">
          <h1>Aktuellt just nu</h1>
          <div className="article">
            <h2>Tablå</h2>
            <div dangerouslySetInnerHTML={{__html: schedule && schedule.marked}} />
          </div>
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
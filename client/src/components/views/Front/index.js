const React = require('react')
const Modal = require('../../../services/Modal')
const TweetStore = require('../../../stores/TweetStore')
const ArticleStore = require('../../../stores/ArticleStore')
const TwitterFeed = require('../../reusable/TwitterFeed')
const Article = require('./Article')
const Schedule = require('./Schedule')

class Front extends React.Component {
  componentWillMount() {
    ArticleStore.getSchedule(schedule => this.setState({ schedule }), true)
    ArticleStore.get(articles => this.setState({articles}))
    this.unsubscribe = TweetStore.subscribe(tweets => this.setState({tweets}))
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  render() {
    const { articles, schedule, tweets } = this.state
    return (
      <div id="front" className="row">
        <div className="two-thirds column">
          {schedule && <Schedule {...schedule} />}
          {articles.map(article => <Article key={article._id} article={article} />)}
        </div>
        <div className="one-third column">
          {tweets.length > 0 && <span className="hashtagJulradio">#julradio</span>}
          <div className="compose" onClick={Modal.open.bind(null, 'RequestSong')}>
            Skriv en önskning...
          </div>
          <span className="informer">Godkända önskningar och tweets med #julradio</span>
          <TwitterFeed tweets={tweets} />
        </div>
      </div>
    )
  }
}

module.exports = Front
const React = require('react')
const Modal = require('../../../services/Modal')
const RequestStore = require('../../../stores/RequestStore')
const ArticleStore = require('../../../stores/ArticleStore')
const TwitterFeed = require('../../reusable/TwitterFeed')
const Article = require('./Article')
const Schedule = require('./Schedule')

class Front extends React.Component {
  componentWillMount() {
    ArticleStore.getSchedule(schedule => this.setState({ schedule }), true)
    ArticleStore.get(articles => this.setState({ articles }))
    this.unsubscribe = RequestStore.subscribe(requests => this.setState({ requests }))
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  render() {
    const { articles, schedule, requests } = this.state
    return (
      <div id="Front" className="row">
        <div className="two-thirds column">
          {articles.map(article => <Article key={article._id} article={article} />)}
        </div>
        <div className="one-third column">
          {schedule && <Schedule {...schedule} />}
          <div className="compose" onClick={Modal.open.bind(null, 'RequestSong')}>
            Skriv en önskning...
          </div>
          <span className="informer">Godkända önskningar och tweets med #julradio</span>
          <TwitterFeed tweets={requests} />
        </div>
      </div>
    )
  }
}

module.exports = Front
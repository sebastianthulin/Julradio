const React = require('react')
const { Link } = require('react-router')
const Modal = require('../../../services/Modal')
const RequestStore = require('../../../stores/RequestStore')
const ArticleStore = require('../../../stores/ArticleStore')
const Feed = require('../../reusable/Feed')
const Article = require('../../reusable/Article')
const SVG = require('../../svg')
const Schedule = require('./Schedule')

class Front extends React.Component {
  componentWillMount() {
    ArticleStore.get(articles => this.setState({ articles }))
    this.unsubscribe = RequestStore.subscribe(requests => this.setState({ requests }))
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  render() {
    const { articles, requests } = this.state
    return (
      <div id="Front" className="row">
        <div className="twoThirds column">
          {articles.map(article => (
            <div className="article" key={article._id}>
              <Article article={article} />
              <Link to={`/article/${article._id}`} className="commentLink">
                <SVG.Comment />
                <span>{article.numComments}</span>
              </Link>
            </div>
          ))}
        </div>
        <div className="oneThird column">
          <Schedule />
          <div className="compose" onClick={Modal.open.bind(null, 'RequestSong')}>
            Skriv en önskning...
          </div>
          <span className="informer">Godkända önskningar och tweets med #julradio</span>
          <Feed tweets={requests} />
          <div className="sponsorer">
            <a href="http://tidningskungen.se" target="blank"><img src="/images/tidningskungen.png"/></a>
            <a href="http://sfanytime.se" target="blank"><img className="sfanytime" src="/images/sf_anytime.png"/></a>
          </div>
        </div>
      </div>
    )
  }
}

module.exports = Front
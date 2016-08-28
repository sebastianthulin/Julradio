const React = require('react')
const {connect} = require('react-redux')
const {Link} = require('react-router')
const {fetchArticles} = require('../../../actions/articles')
const {openModal} = require('../../../actions/modal')
const Article = require('../../reusable/Article')
const SVG = require('../../svg')
const Schedule = require('./Schedule')
const Feed = require('./Feed')

@connect(state => {
  const byId = state.articles.get('byId')
  const articles = state.articles.get('ids').map(id => byId.get(id))
  return {
    articles: articles.filter((article, i) => i < 5 && article.get('pinned') === false),
    pins: articles.filter((article, i) => article.get('pinned') === true)
  }
}, {
  fetchArticles,
  openModal
})
class Front extends React.Component {
  componentWillMount() {
    this.props.fetchArticles()
  }

  renderPin(article) {
    return (
      <Link key={article.get('_id')} to={`/article/${article.get('_id')}`} className="pin">
        <span>{article.get('title')}</span>
        <SVG.Right />
      </Link>
    )
  }

  renderArticle(article) {
    return (
      <div className="article" key={article.get('_id')}>
        <Article article={article} />
        <Link to={`/article/${article.get('_id')}`} className="commentLink">
          <SVG.Comment />
          <span>{article.get('numComments')}</span>
        </Link>
      </div>
    )
  }

  render() {
    const {articles, pins, openModal} = this.props
    return (
      <div id="Front" className="row">
        <div className="twoThirds column">
          {articles.size === 0 && <div style={{height: 1}} />}
          {pins.size > 0 && (
            <div className="pins">
              {pins.map(this.renderPin.bind(this))}
            </div>
          )}
          {articles.map(this.renderArticle.bind(this))}
          {articles.size > 0 && (
            <Link to="/archive" style={{display: 'table', marginBottom: 20}}>
              Läs gamla nyheter på arkivet...
            </Link>
          )}
        </div>
        <div className="oneThird column">
          <Schedule />
          <div className="compose" onClick={() => openModal('RequestSong')}>
            Skriv en önskning...
          </div>
          <span className="informer">Godkända önskningar och tweets med #julradio</span>
          <Feed />
          <a href="https://www.facebook.com/julradio/" target="_blank" className="facerurubohorukuru">
            <div className="boxie"></div>
            <div className="textie">Gilla oss på facebook!</div>
            <img src="/images/thumb.png"/>
          </a>
        </div>
      </div>
    )
  }
}

module.exports = Front

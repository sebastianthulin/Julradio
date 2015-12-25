const React = require('react')
const { connect } = require('react-redux')
const { Link } = require('react-router')
const { fetchArticles } = require('../../../actions/articles')
const { openModal } = require('../../../actions/modal')
const Article = require('../../reusable/Article')
const SVG = require('../../svg')
const Schedule = require('./Schedule')
const Feed = require('./Feed')

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
    const { articles, pins, openModal } = this.props
    return (
      <div id="Front" className="row">
        <div className="twoThirds column">
          {articles.size === 0 && <div style={{height: 1}} />}
          {pins.size > 0 && (
            <div className="pins">
              {pins.map(this.renderPin.bind(this)).toArray()}
            </div>
          )}
          {articles.map(this.renderArticle.bind(this)).toArray()}
          {articles.size > 0 && (
            <Link to="/archive" style={{display: 'table', marginBottom: 20}}>
              Läs gamla nyheter på arkivet!
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
          <div className="sponsors">
            <a href="http://tidningskungen.se" target="blank">
              <img src="/images/tidningskungen.png" alt="Tidningskungen" />
            </a>
            <a href="http://sfanytime.se" target="blank">
              <img className="sfanytime" src="/images/sf_anytime.png" alt="SF Anytime" />
            </a>
          </div>
        </div>
      </div>
    )
  }
}

module.exports = connect(
  state => {
    const articles = state.articles
      .get('ids')
      .map(id => state.articles.getIn(['byId', id]))
    return {
      articles: articles.filter((a, i) => i < 5 && a.get('pinned') === false),
      pins: articles.filter((a, i) => a.get('pinned') === true)
    }
  },
  dispatch => ({
    fetchArticles: () => dispatch(fetchArticles()),
    openModal: modalName => dispatch(openModal(modalName))
  })
)(Front)
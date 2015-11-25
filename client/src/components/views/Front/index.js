const React = require('react')
const { Link } = require('react-router')
const Modal = require('../../../services/Modal')
const ArticleStore = require('../../../stores/ArticleStore')
const Article = require('../../reusable/Article')
const SVG = require('../../svg')
const Schedule = require('./Schedule')
const Feed = require('./Feed')

class Front extends React.Component {
  componentWillMount() {
    ArticleStore.get(articles => this.setState({ articles }))
  }

  render() {
    const { articles } = this.state
    return (
      <div id="Front" className="row">
        <div className="twoThirds column">
          {articles.length === 0 && <div style={{height: 1}} />}
          {articles.map(article => (
            <div className="article" key={article._id}>
              <Article article={article} />
              <Link to={`/article/${article._id}`} className="commentLink">
                <SVG.Comment />
                <span>{article.numComments}</span>
              </Link>
            </div>
          ))}
          {articles.length > 0 && <Link to="/archive">Läs gamla nyheter på arkivet!</Link>}
        </div>
        <div className="oneThird column">
          <Schedule />
          <div className="compose" onClick={Modal.open.bind(null, 'RequestSong')}>
            Skriv en önskning...
          </div>
          <span className="informer">Godkända önskningar och tweets med #julradio</span>
          <Feed />
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

module.exports = Front
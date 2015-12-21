const React = require('react')
const { connect } = require('react-redux')
const { Link } = require('react-router')
const { fetchAllArticles } = require('../../actions/articles')

const months = [
  'Januari',
  'Februari',
  'Mars',
  'April',
  'Maj',
  'Juni',
  'Juli',
  'Augusti',
  'September',
  'Oktober',
  'November',
  'December'
]

class Article extends React.Component {
  render() {
    const { article } = this.props
    const dateInHuman = article.get('date').getDate() + ' ' + months[article.get('date').getMonth()] + ' ' + article.get('date').getFullYear()
    return (
      <Link to={`/article/${article.get('_id')}`} className="article">
        <h3>{article.get('title')}</h3>
        <p>{dateInHuman}</p>
      </Link>
    )
  }
}

class ArticleArchive extends React.Component {
  componentWillMount() {
    this.props.fetchAllArticles()
  }

  render() {
    const { articles } = this.props
    return (
      <div id="ArticleArchive">
        {articles.map(article => (<Article
          key={article.get('_id')}
          article={article}
        />)).toJS()}
      </div>
    )
  }
}

module.exports = connect(
  state => ({
    articles: state.articles
      .get('ids')
      .map(id => state.articles.getIn(['byId', id]))
  }),
  dispatch => ({
    fetchAllArticles: () => dispatch(fetchAllArticles())
  })
)(ArticleArchive)
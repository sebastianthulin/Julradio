const React = require('react')
const { Link } = require('react-router')
const ArticleStore = require('../../stores/ArticleStore')

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
    const dateInHuman = article.date.getDay() + ' ' + months[article.date.getMonth()] + ' ' + article.date.getFullYear()
    return (
      <Link to={`/article/${article._id}`} className="article">
        <h3>{article.title}</h3>
        <p>{dateInHuman}</p>
      </Link>
    )
  }
}

class ArticleArchive extends React.Component {
  componentWillMount() {
    ArticleStore.get(articles => this.setState({ articles }), true)
  }

  render() {
    const { articles } = this.state || []
    return (
      <div id="ArticleArchive">
        {articles.map(article => (<Article key={article._id} article={article} />))}
      </div>
    )
  }
}

module.exports = ArticleArchive
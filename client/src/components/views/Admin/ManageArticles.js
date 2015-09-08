var React = require('react')
var { Link } = require('react-router')
var NewsStore = require('../../../stores/NewsStore')
var ManageArticle = require('./ManageArticle')

class ManageArticles extends React.Component {
  componentWillMount() {
    NewsStore.subscribe(this.handleArticles.bind(this))
  }

  componentDidMount() {
    this.setArticle(this.props.param)
  }

  componentWillReceiveProps(props) {
    this.setArticle(props.param)
  }

  handleArticles(articles) {
    this.setState({articles})
  }

  setArticle(articleId) {
    this.setState({selected: articleId})
  }

  render() {
    var { articles, selected } = this.state
    var selectedArticle = articles.filter(article => article._id === selected)[0]

    return (
      <div>
        <div className="three columns">
          <h3>Admin - Nyheter</h3>
          <div className="list">
            {articles.map(article => <Link key={article._id} to={'/admin/articles/' + article._id}>{article.title}</Link>)}
          </div>
        </div>
        {selectedArticle && <ManageArticle key={selectedArticle._id} article={selectedArticle} />}
      </div>
    )
  }
}

module.exports = ManageArticles
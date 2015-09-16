var React = require('react')
var { Link } = require('react-router')
var NewsStore = require('../../../stores/NewsStore')
var ManageArticle = require('./ManageArticle')

class ManageArticles extends React.Component {
  componentWillMount() {
    this.unsubscribe = NewsStore.subscribe(this.handleArticles.bind(this))
  }

  componentDidMount() {
    this.selectedId = this.props.param
    this.setArticle()
  }

  componentWillReceiveProps(props) {
    this.selectedId = props.param
    this.setArticle()
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  handleArticles(articles) {
    this.articles = articles
    this.setState({articles})
    this.setArticle()
  }

  setArticle() {
    var selected = this.articles.filter(article => article._id === this.selectedId)[0]
    this.setState({selected})
  }

  create() {
    NewsStore.create(article => {
      this.context.router.transitionTo('/admin/articles/' + article._id)
      this.setState({selected: article})
    })
  }

  render() {
    var { articles, selected } = this.state

    return (
      <div>
        <div className="adminContent three columns">
          <h3>Nyheter</h3>
          <button onClick={this.create.bind(this)}>Skapa ny</button>
          <div className="list">
            {articles.map(article => <Link key={article._id} to={'/admin/articles/' + article._id}>{article.title}</Link>)}
          </div>
        </div>
        {selected && <ManageArticle key={selected._id} article={selected} />}
      </div>
    )
  }
}

ManageArticles.contextTypes = {
  router: React.PropTypes.func
}

module.exports = ManageArticles
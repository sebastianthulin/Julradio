var React = require('react')
var { Link } = require('react-router')
var NewsStore = require('../../../stores/NewsStore')
var ManageArticle = require('./ManageArticle')

class ManageArticles extends React.Component {
  componentWillMount() {
    this.unsubscribe = NewsStore.subscribe(this.handleArticles.bind(this))
    this.setArticle(this.props.param)
  }

  componentWillReceiveProps(props) {
    this.setArticle(props.param)
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  handleArticles(articles) {
    this.articles = articles
    this.setState({articles})
    this.setArticle()
  }

  setArticle(id) {
    id = parseInt(id || this.props.param)
    this.selectedId = id
    var selected = this.articles.filter(article => article.id === id)[0]
    this.setState({selected})
  }

  goto(ev) {
    var articleId = ev.target.value
    this.context.router.transitionTo('/admin/articles/' + articleId)
    this.setState({creatingNew: false})
  }

  create() {
    this.context.router.transitionTo('/admin/articles')
    this.setState({creatingNew: true})
  }

  render() {
    var { articles, creatingNew, selected } = this.state
    return (
      <div className="ten columns">
        <h3>Nyheter</h3>
        <select value={this.selectedId} onChange={this.goto.bind(this)}>
          {articles.map(article => <option value={article.id} key={article.id}>{article.title}</option>)}
        </select>
        <button onClick={this.create.bind(this)}>Skapa ny</button>
        {creatingNew && <ManageArticle article={{}} />}
        {!creatingNew && selected && <ManageArticle key={selected.id} article={selected} />}
      </div>
    )
  }
}

ManageArticles.contextTypes = {
  router: React.PropTypes.func
}

module.exports = ManageArticles
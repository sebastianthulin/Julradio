const React = require('react')
const { Link } = require('react-router')
const NewsStore = require('../../../stores/NewsStore')
const ManageArticle = require('./ManageArticle')

class ManageArticles extends React.Component {
  componentWillMount() {
    this.unsubscribe = NewsStore.subscribe(this.handleArticles.bind(this))
    this.setArticle(this.props.params.id)
  }

  componentWillReceiveProps(props) {
    this.setArticle(props.params.id)
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
    id = id || this.props.params.id
    this.selectedId = id
    const selected = this.articles.filter(article => article._id === id)[0]
    this.setState({selected})
  }

  goto(ev) {
    var articleId = ev.target.value
    this.props.history.pushState(null, `/admin/articles/${articleId}`)
    this.setState({creatingNew: false})
  }

  create() {
    this.props.history.pushState(null, '/admin/articles')
    this.setState({creatingNew: true})
  }

  render() {
    const { articles, creatingNew, selected } = this.state
    const { history } = this.props
    return (
      <div className="ten columns">
        <h3>Nyheter</h3>
        <select value={this.selectedId} onChange={this.goto.bind(this)}>
          {articles.map(article => <option value={article._id} key={article._id}>{article.title}</option>)}
        </select>
        <button onClick={this.create.bind(this)}>Skapa ny</button>
        {creatingNew && <ManageArticle article={{}} history={history} />}
        {!creatingNew && selected && <ManageArticle key={selected._id} article={selected} history={history} />}
      </div>
    )
  }
}

module.exports = ManageArticles
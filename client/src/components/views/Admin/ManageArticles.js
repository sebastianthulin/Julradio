const React = require('react')
const ArticleStore = require('../../../stores/ArticleStore')
const ManageArticle = require('./ManageArticle')

class ManageArticles extends React.Component {
  componentWillMount() {
    this.unsubscribe = ArticleStore.subscribe(this.handleArticles.bind(this))
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
    this.setState({ articles })
    this.setArticle(this.props.params.id)
  }

  setArticle(id) {
    const selected = this.articles.filter(article => article._id === id)[0]
    this.setState({
      selected,
      selectedId: id || '',
      creatingNew: false
    })
  }

  goto({ target: { value: articleId } }) {
    this.props.history.pushState(null, `/admin/articles/${articleId}`)
  }

  create() {
    this.setState({creatingNew: true})
  }

  render() {
    const { articles, creatingNew, selected, selectedId } = this.state
    const { history } = this.props
    return (
      <div id="ManageArticles">
        <h3>Nyheter</h3>
        <select value={selectedId} onChange={this.goto.bind(this)} style={{width: 'auto', marginRight: 5}}>
          <option value={''}>Välj artikel</option>
          {articles.map(article => <option value={article._id} key={article._id}>{article.title}</option>)}
        </select>
        <button onClick={this.create.bind(this)}>Skapa ny</button>
        {creatingNew && <ManageArticle article={{}} history={history} />}
        {!creatingNew && selected && <ManageArticle key={selected._id} article={selected} history={history} />}
        <span>
          Här kan <a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet" target="_blank">markdown</a> användas.
        </span>
      </div>
    )
  }
}

module.exports = ManageArticles
const React = require('react')
const { Link } = require('react-router')
const ArticleStore = require('../../../stores/ArticleStore')
const ManageArticle = require('./ManageArticle')
const TimeSince = require('../../reusable/TimeSince')
const SVG = require('../../svg')

class ManageArticles extends React.Component {
  componentWillMount() {
    this.state = {articles: []}
    this.handleRoute(this.props.params.id)
  }

  componentWillReceiveProps(props) {
    this.handleRoute(props.params.id)
  }

  handleRoute(id) {
    if (id) {
      this.setArticle(id)
    } else {
      this.fetchArticles()
    }
  }

  fetchArticles() {
    ArticleStore.getAll(({ articles, pinnedId }) => this.setState({
      articles,
      pinnedId,
      selected: null,
      creatingNew: false
    }))
  }

  setArticle(id) {
    ArticleStore.getById(id, article => this.setState({
      selected: article,
      creatingNew: false
    }))
  }

  create() {
    this.setState({creatingNew: true})
  }

  pin(article, ev) {
    ev.preventDefault()
    this.setState({
      pinnedId: article._id
    })
  }

  unpin() {
    this.setState({pinnedId: null})
  }

  savePin() {
    ArticleStore.savePin(this.state.pinnedId)
  }

  renderPinned() {
    const { pinnedId } = this.state
    const pinned = this.state.articles.find(a => a._id === pinnedId)
    return pinned ? (
      <div>
        {pinned.title}
        <button className="btn" onClick={this.unpin.bind(this)}>Unpin</button>
      </div>
    ) : (
      <div style={{marginBottom: 20}}>No pin</div>
    )
  }

  renderArticle(article) {
    return (
      <Link className="manageArticle" to={`/admin/articles/${article._id}`} key={article._id}>
        <span className="title">{article.title}</span>
        <span className="author">
          {article.user ? article.user.name : 'Julradio'}
        </span>
        <TimeSince date={article.date} />
        <button onClick={this.pin.bind(this, article)}>
          <SVG.Pin />
        </button>
      </Link>
    )
  }

  render() {
    const { articles, creatingNew, selected } = this.state
    const { history } = this.props
    return creatingNew ? (
      <ManageArticle article={{}} history={history} />
    ) : selected ? (
      <ManageArticle key={selected._id} article={selected} history={history} />
    ) : (
      <div>
        <h3>Nyheter</h3>
        <div className="pin">
          <h4>Pinned</h4>
          {this.renderPinned()}
          <button onClick={this.savePin.bind(this)} className="btn">Spara</button>
        </div>
        {articles.map(this.renderArticle.bind(this))}
        <br/>
        <button className="btn" onClick={this.create.bind(this)}>Skapa ny</button>
      </div>
    )
  }
}

module.exports = ManageArticles
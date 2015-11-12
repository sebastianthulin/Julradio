const React = require('react')
const { Link } = require('react-router')
const ArticleStore = require('../../../stores/ArticleStore')
const ManageArticle = require('./ManageArticle')
const TimeSince = require('../../reusable/TimeSince')

class ManageArticles extends React.Component {
    const store = require('../../../stores/NotificationStore')
    const user = require('../../../services/User').get()
    store.insert({
      type: 'message',
      from: err ? null : user
    }, err)
  }

  componentWillMount() {
    this.state = {}
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
    this.state.articles = articles
    this.setArticle(this.props.params.id)
  }

  setArticle(id) {
    const selected = this.state.articles.filter(article => article._id === id)[0]
    this.setState({
      selected,
      creatingNew: false
    })
  }

  create() {
    this.setState({creatingNew: true})
  }

  renderArticle(article) {
    return (
      </Link>
    )
  }

  render() {
    const { history } = this.props
    return creatingNew ? (
      <ManageArticle article={{}} history={history} />
    ) : selected ? (
      <ManageArticle key={selected._id} article={selected} history={history} />
    ) : (
      <div>
        <h3>Nyheter</h3>
        {articles.map(this.renderArticle.bind(this))}
        <br/>
        <button className="btn" onClick={this.create.bind(this)}>Skapa ny</button>
      </div>
    )
  }
}

module.exports = ManageArticles
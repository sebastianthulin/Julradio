const React = require('react')
const {connect} = require('react-redux')
const {Link} = require('react-router')
const cx = require('classnames')
const articleActions = require('../../../actions/articles')
const ManageArticle = require('./ManageArticle')
const TimeSince = require('../../reusable/TimeSince')
const SVG = require('../../svg')

@connect(state => {
  const byId = state.articles.get('byId')
  const editing = state.articles.get('editing')
  const articles = state.articles.get('ids').map(id => byId.get(id))
  return {editing, articles}
}, {
  fetchAllArticles: articleActions.fetchAllArticles,
  editArticle: articleActions.editArticle,
  cancelEdit: articleActions.cancelEdit,
  updateArticleLocally: articleActions.updateArticleLocally,
  createArticle: articleActions.createArticle,
  updateArticle: articleActions.updateArticle,
  deleteArticle: articleActions.deleteArticle,
  togglePin: articleActions.togglePin
})
class ManageArticles extends React.Component {
  componentWillMount() {
    this.handleRoute(this.props.params.id)
  }

  componentWillReceiveProps(props) {
    if (props.params.id !== this.props.params.id) {
      this.handleRoute(props.params.id)
    }
  }

  handleRoute(id) {
    if (id) {
      this.props.editArticle(id)
    } else {
      this.props.cancelEdit()
      this.props.fetchAllArticles()
    }
  }

  create() {
    this.props.editArticle()
  }

  togglePin(id, ev) {
    ev.preventDefault()
    this.props.togglePin(id)
  }

  render() {
    const {articles, editing, togglePin} = this.props
    return editing ? (
      <ManageArticle {...this.props} />
    ) : (
      <div>
        <h3>Nyheter</h3>
        {articles.map(article => (
          <Link className="manageArticle" to={`/admin/articles/${article.get('_id')}`} key={article.get('_id')}>
            <span className="title">{article.get('title')}</span>
            <span className="author">
              {article.get('user') ? article.getIn(['user', 'name']) : 'Julradio'}
            </span>
            <TimeSince date={article.get('date')} />
            <button
              onClick={this.togglePin.bind(this, article.get('_id'))}
              className={cx({active: article.get('pinned')})}
              children={<SVG.Pin />}
            />
          </Link>
        ))}
        <br/>
        <button className="btn" onClick={this.create.bind(this)}>Skapa ny</button>
      </div>
    )
  }
}

module.exports = ManageArticles

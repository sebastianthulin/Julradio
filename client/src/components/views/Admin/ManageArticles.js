const React = require('react')
const { connect } = require('react-redux')
const { Link } = require('react-router')
const cx = require('classnames')
const {
  fetchAllArticles,
  editArticle,
  cancelEdit,
  updateArticleLocally,
  createArticle,
  updateArticle,
  deleteArticle,
  togglePin
} = require('../../../actions/articles')
const ManageArticle = require('./ManageArticle')
const TimeSince = require('../../reusable/TimeSince')
const SVG = require('../../svg')

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
    const { articles, editing, togglePin } = this.props
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
        )).toJS()}
        <br/>
        <button className="btn" onClick={this.create.bind(this)}>Skapa ny</button>
      </div>
    )
  }
}

module.exports = connect(
  state => ({
    editing: state.articles.get('editing'),
    articles: state.articles
      .get('ids')
      .map(id => state.articles.getIn(['byId', id]))
  }),
  dispatch => ({
    fetchAllArticles: () => dispatch(fetchAllArticles()),
    editArticle: id => dispatch(editArticle(id)),
    cancelEdit: () => dispatch(cancelEdit()),
    updateArticleLocally: props => dispatch(updateArticleLocally(props)),
    createArticle: () => dispatch(createArticle()),
    updateArticle: () => dispatch(updateArticle()),
    deleteArticle: () => dispatch(deleteArticle()),
    togglePin: id => dispatch(togglePin(id))
  })
)(ManageArticles)
const React = require('react')
const { connect } = require('react-redux')
const { fetchArticle } = require('../../actions/articles')
const Article = require('../reusable/Article')
const Comments = require('../reusable/Comments')

class ArticleView extends React.Component {
  componentWillMount() {
    const { id } = this.props.params
    this.props.fetchArticle(id)
  }

  render() {
    const { article } = this.props
    return (
      <div id="ArticleView">
        {article && <Article key={article.get('_id')} article={article} />}
        {article && <Comments type="article" target={article.get('_id')} />}
      </div>
    )
  }
}

module.exports = connect(
  state => ({
    article: state.articles.getIn(['byId', state.articles.get('selected')])
  }),
  dispatch => ({
    fetchArticle: id => dispatch(fetchArticle(id))
  })
)(ArticleView)
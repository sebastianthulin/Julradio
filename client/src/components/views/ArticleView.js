const React = require('react')
const {connect} = require('react-redux')
const {fetchArticle} = require('../../actions/articles')
const Article = require('../reusable/Article')
const Comments = require('../reusable/Comments')

@connect((state, props) => ({
  article: state.articles.getIn(['byId', props.params.id])
}), {
  fetchArticle
})
class ArticleView extends React.Component {
  componentWillMount() {
    const {id} = this.props.params
    this.props.fetchArticle(id)
  }

  componentWillReceiveProps(props) {
    const {id} = props.params
    if (id !== this.props.params.id) {
      this.props.fetchArticle(id)
    }
  }

  render() {
    const {article, params: {id}} = this.props
    return (
      <div key={id} id="ArticleView">
        {article && <Article article={article} />}
        {article && <Comments type="article" target={id} />}
      </div>
    )
  }
}

module.exports = ArticleView

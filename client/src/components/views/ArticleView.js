const React = require('react')
const ArticleStore = require('../../stores/ArticleStore')
const Article = require('../reusable/Article')
const Comments = require('../reusable/Comments')

class ArticleView extends React.Component {
  componentWillMount() {
    const { id } = this.props.params
    ArticleStore.getById(id, article => this.setState({ article }))
  }

  render() {
    const { article } = this.state || {}
    return (
      <div id="ArticleView">
        {article && <Article key={article._id} article={article} />}
        {article && <Comments type="article" target={article._id} />}
      </div>
    )
  }
}

module.exports = ArticleView
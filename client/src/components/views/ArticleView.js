const React = require('react')
const { Link } = require('react-router')
const User = require('../../services/User')
const ArticleStore = require('../../stores/ArticleStore')
const Article = require('../reusable/Article')
const Comments = require('../reusable/Comments')

class ArticleView extends React.Component {
  componentWillMount() {
    const { id } = this.props.params
    ArticleStore.getOne(id, data => this.setState({ 
      article: data.article,
      comments: data.comments
    })) 
  }

  comment(ev) {
    const { id } = this.props.params
    ev.preventDefault()
    User.articleComment(id, this.refs.comment.value).then(({ body: comment }) => {
      this.componentWillMount()
    })
  }

  commentRemovedHandler() {
    this.componentWillMount()
  }

  render() {
    const { article, comments } = this.state || {}
    return (
      <div id="ArticleView">
        {article && <Article key={article._id} article={article} />}
        <form onSubmit={this.comment.bind(this)}>
          <input className="commentsInput clean" type="text" ref="comment" placeholder="Kommentera" />
        </form>
        {comments && <Comments comments={comments} onDelete={this.commentRemovedHandler.bind(this)} />}
      </div>
    )
  }
}

module.exports = ArticleView
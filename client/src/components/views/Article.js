const React = require('react')
const User = require('../../services/User')
const ArticleStore = require('../../stores/ArticleStore')
const Article = require('../reusable/Article')

class Comment extends React.Component {
  render() {
    const { comment } = this.props
    return (
      <div className="ArticleComment">
        <div className="comment">
          <div className="commentPic"></div>
          <div className="commentUser">Oliver Johansson</div>
          <div className="commentTime">2015-11-15</div>
          <div className="commentText">{comment.text}</div>
        </div>
      </div>
    )
  }
}

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
    User.comment(id, this.refs.comment.value, () => location.reload())
  }

  render() {
    const { article, comments } = this.state || {}
    console.log(comments)
    return (
      <div id="ArticleView">
        {article && <Article key={article._id} article={article} />}
        <form onSubmit={this.comment.bind(this)}>
          <input className="commentsInput" type="text" ref="comment" placeholder="Kommentera" />
        </form>

        
          {comments && comments.map(comment => <Comment key={comment._id} comment={comment} />)}
        
      </div>
    )
  }
}

module.exports = ArticleView
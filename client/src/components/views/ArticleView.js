const React = require('react')
const { Link } = require('react-router')
const User = require('../../services/User')
const ArticleStore = require('../../stores/ArticleStore')
const ProfilePicture = require('../reusable/ProfilePicture')
const TimeSince = require('../reusable/TimeSince')
const Article = require('../reusable/Article')

class Comment extends React.Component {
  render() {
    const { comment } = this.props
    return (
      <div className="ArticleComment">
        <ProfilePicture id={comment.user.picture} />
        <Link to={'/@' + comment.user.username} className="commentUser">{comment.user.username}</Link>
        <TimeSince date={comment.date} />
        <div className="commentText">{comment.text}</div>
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
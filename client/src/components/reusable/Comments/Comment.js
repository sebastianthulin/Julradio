const React = require('react')
const { Link } = require('react-router')
const history = require('../../../services/history')
const CommentStore = require('../../../stores/CommentStore')
const ProfilePicture = require('../ProfilePicture')
const TimeSince = require('../TimeSince')

class Comment extends React.Component {
  componentWillMount() {
    const { comment, user, admin } = this.props
    const userId = user && user._id
    this.isReply = comment.replyTo
    this.removable = admin || userId === comment.user._id || userId === comment.owner
  }

  delete() {
    const { comment, onDelete } = this.props
    if (!confirm('Ta bort inlägg?')) return
    CommentStore.deleteComment(comment._id).then(onDelete).catch(err => {
      console.error(err)
      alert('Något gick fel')
    })
  }

  handleClick(ev) {
    if (ev.target.tagName === 'A' && ev.metaKey === false) {
      ev.preventDefault()
      history.pushState(null, ev.target.pathname)
    }
  }

  render() {
    const { comment, replies } = this.props
    return (
      <div className="Comment">
        <ProfilePicture id={comment.user.picture} />
        <div>
          <header>
            <Link to={'/@' + comment.user.username}>{comment.user.username}</Link>
            <TimeSince date={comment.date} />
          </header>
          <div
            className="text"
            onClick={this.handleClick.bind(this)}
            dangerouslySetInnerHTML={comment}
          />
          {this.removable && <button className="delete" onClick={this.delete.bind(this)}>x</button>}
        </div>
      </div>
    )
  }
}

module.exports = Comment
const React = require('react')
const { Link } = require('react-router')
const CommentStore = require('../../../stores/CommentStore')
const NotificationStore = require('../../../stores/NotificationStore')
const ProfilePicture = require('../ProfilePicture')
const TimeSince = require('../TimeSince')
const MDMini = require('../MDMini')

class Comment extends React.Component {
  componentWillMount() {
    const { comment, user, admin } = this.props
    const userId = user && user._id
    this.isReply = comment.replyTo
    this.removable = admin || userId === comment.user._id || userId === comment.owner
  }

  delete() {
    const { comment, onDelete } = this.props
    if (confirm('Ta bort inlägg?')) {
      CommentStore.deleteComment(comment._id, onDelete)
    }
  }

  render() {
    const { comment, replies } = this.props
    return (
      <div className="Comment">
        <ProfilePicture id={comment.user.picture} />
        <div className="content">
          <header>
            <Link to={'/@' + comment.user.username}>{comment.user.username}</Link>
            <TimeSince date={comment.date} />
          </header>
          <MDMini className="text" text={comment.text} />
          {this.removable && <button className="delete" onClick={this.delete.bind(this)}>x</button>}
        </div>
      </div>
    )
  }
}

module.exports = Comment
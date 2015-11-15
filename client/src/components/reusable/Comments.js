const React = require('react')
const { Link } = require('react-router')
const User = require('../../services/User')
const ProfilePicture = require('./ProfilePicture')
const TimeSince = require('./TimeSince')

class Comment extends React.Component {
  componentWillMount() {
    const { comment, user, admin } = this.props
    const userId = user && user._id
    this.removable = admin || userId === comment.userId || userId === comment.owner
    this.isReply = comment.replyTo
  }

  delete() {
    const { comment, onDelete } = this.props
    if (!confirm('Ta bort inlägg?')) return
    User.deleteComment(comment._id).then(() => {
      onDelete && onDelete()
    }).catch(err => {
      console.error(err)
      alert('Något gick fel')
    })
  }

  reply(ev) {
    ev.preventDefault()
    const { comment } = this.props
    const text = this.refs.reply.value
    User.reply(comment._id, text).then(() => {
      // do stuff ig
    }).catch(err => {
      console.log(err)
      alert('Något gick fel')
    })
  }

  render() {
    const { comment } = this.props
    return (
      <div className="Comment">
        <header>
          <ProfilePicture id={comment.user.picture} />
          <div className="user">
            <Link to={'/@' + comment.user.username}>{comment.user.username}</Link>
            <TimeSince date={comment.date} />
          </div>
        </header>
        <div className="text">{comment.text}</div>
        {
          !this.isReply && <form onSubmit={this.reply.bind(this)}>
            <input ref="reply" type="text" placeholder="Svara" />
          </form>
        }
        {this.removable && <button className="delete" onClick={this.delete.bind(this)}>x</button>}
      </div>
    )
  }
}

class Comments extends React.Component {
  componentWillMount() {
    this.user = User.get()
    this.admin = User.isAdmin()
  }

  render() {
    const { user, admin } = this
    const { comments, onDelete } = this.props
    return (
      <div className="Comments">
        {comments.map(comment => <Comment
          key={comment._id}
          comment={comment}
          onDelete={onDelete}
          user={user}
          admin={admin}
        />)}
      </div>
    )
  }
}

module.exports = Comments
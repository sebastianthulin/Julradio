const React = require('react')
const { Link } = require('react-router')
const User = require('../../services/User')
const history = require('../../services/history')
const CommentStore = require('../../stores/CommentStore')
const ProfilePicture = require('./ProfilePicture')
const TimeSince = require('./TimeSince')

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

  reply(ev) {
    ev.preventDefault()
    const { comment } = this.props
    const text = this.refs.reply.value.trim()
    if (!text) return
    CommentStore.reply(comment._id, text).then(() => {
      this.refs.reply.value = ''
    }).catch(err => {
      console.error(err)
      alert('Något gick fel')
    })
  }

  handleClick(ev) {
    ev.preventDefault()
    if (ev.target.tagName === 'A') {
      history.pushState(null, ev.target.pathname)
    }
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
        <div
          className="text"
          dangerouslySetInnerHTML={comment}
          onClick={this.handleClick.bind(this)}
        />
        {comment.numReplies}
        {!this.isReply && (
          <form onSubmit={this.reply.bind(this)}>
            <input ref="reply" type="text" placeholder="Svara" />
          </form>
        )}
        {this.removable && <button className="delete" onClick={this.delete.bind(this)}>x</button>}
      </div>
    )
  }
}

class Comments extends React.Component {
  componentWillMount() {
    this.user = User.get()
    this.admin = User.isAdmin()
    this.fetchComments()
  }

  fetchComments() {
    const { type, target } = this.props
    CommentStore.fetch({ type, target }, comments => this.setState({ comments }))
  }

  post(ev) {
    ev.preventDefault()
    const { type, target } = this.props
    const text = this.refs.input.value.trim()
    if (!text) return
    CommentStore.post({ type, target }, text).then(() => {
      this.refs.input.value = ''
      this.fetchComments()
    }).catch(err => {
      console.error(err)
      alert('något gick fel.')
    })
  }

  renderForm() {
    const { block, placeholder } = this.props
    return block ? null : (
      <form className="mainForm" onSubmit={this.post.bind(this)}>
        <textarea
          type="text"
          ref="input"
          placeholder={placeholder || 'Skriv en kommentar'}
          maxLength={1000}
        />
        <button className="btn">Skicka</button>
      </form>
    )
  }

  render() {
    const { user, admin } = this
    const { comments } = this.state || {}
    if (!comments) return null
    return (
      <div className="Comments">
        {this.renderForm()}
        {comments.map(comment => <Comment
          key={comment._id}
          comment={comment}
          onDelete={this.fetchComments.bind(this)}
          user={user}
          admin={admin}
        />)}
      </div>
    )
  }
}

module.exports = Comments